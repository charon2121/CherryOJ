#include "infra/process_executor.h"

#include <fcntl.h>
#include <signal.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

#include <chrono>
#include <cstdio>
#include <filesystem>
#include <fstream>
#include <stdexcept>
#include <string>
#include <vector>

namespace cherry::infra {
namespace {
std::string ReadFile(const std::string& path) {
    std::ifstream ifs(path, std::ios::in | std::ios::binary);
    if (!ifs.good()) {
        return "";
    }
    return std::string((std::istreambuf_iterator<char>(ifs)),
                       std::istreambuf_iterator<char>());
}

std::string CreateTempFile() {
    std::string tmpl = "/tmp/cherry_XXXXXX";
    std::vector<char> buffer(tmpl.begin(), tmpl.end());
    buffer.push_back('\0');
    int fd = mkstemp(buffer.data());
    if (fd < 0) {
        throw std::runtime_error("mkstemp failed");
    }
    close(fd);
    return std::string(buffer.data());
}

}  // namespace

ProcessResult ProcessExecutor::Run(const std::vector<std::string>& argv,
                                   const std::string& stdin_data,
                                   int64_t timeout_ms,
                                   const std::string& working_path = "") const {
    if (argv.empty()) {
        throw std::invalid_argument("argv is empty");
    }

    ProcessResult result;

    auto start = std::chrono::steady_clock::now();

    const std::string stdout_file = CreateTempFile();
    const std::string stderr_file = CreateTempFile();

    int stdin_pipe[2] = {-1, -1};

    if (::pipe(stdin_pipe) != 0) {
        std::filesystem::remove(stdout_file);
        std::filesystem::remove(stderr_file);
    }

    pid_t pid = fork();

    if (pid < 0) {  // error
        close(stdin_pipe[0]);
        close(stdin_pipe[1]);
        std::filesystem::remove(stdout_file);
        std::filesystem::remove(stderr_file);
        throw std::runtime_error("fork failed");
    }

    if (pid == 0) {  // child
        int out_fd = open(stdout_file.c_str(), O_WRONLY | O_TRUNC);
        int err_fd = open(stderr_file.c_str(), O_WRONLY | O_TRUNC);

        if (out_fd < 0 || err_fd < 0) {
            _exit(127);
        }

        dup2(stdin_pipe[0], STDIN_FILENO);
        dup2(out_fd, STDOUT_FILENO);
        dup2(out_fd, STDERR_FILENO);

        close(stdin_pipe[0]);
        close(stdin_pipe[1]);
        close(out_fd);
        close(err_fd);

        if (!working_path.empty()) {
            if (chdir(working_path.c_str()) != 0) {
                _exit(127);
            }
        }

        std::vector<char*> exec_argv;
        exec_argv.reserve(argv.size() + 1);

        for (const auto& item : argv) {
            exec_argv.push_back(const_cast<char*>(item.c_str()));
        }

        exec_argv.push_back(nullptr);
        execvp(exec_argv[0], exec_argv.data());

        _exit(127);
    }

    // parent
    close(stdin_pipe[0]);

    if (!stdin_data.empty()) {
        (void)!write(stdin_pipe[1], stdin_data.data(), stdin_data.size());
    }

    close(stdin_pipe[1]);

    int status = 0;

    while (true) {
        pid_t wait_res = waitpid(pid, &status, WNOHANG);

        if (wait_res == pid) {
            break;
        }

        auto now = std::chrono::steady_clock::now();
        auto elapsed_ms =
            std::chrono::duration_cast<std::chrono::milliseconds>(now - start)
                .count();

        if (elapsed_ms > timeout_ms) {
            result.timed_out = true;
            kill(pid, SIGKILL);
            waitpid(pid, &status, 0);
            break;
        }

        usleep(1000);
    }

    auto end = std::chrono::steady_clock::now();

    result.elapsed_ms =
        std::chrono::duration_cast<std::chrono::milliseconds>(end - start)
            .count();

    if (WIFEXITED(status)) {
        result.exit_code = WEXITSTATUS(status);
    } else if (WIFSIGNALED(status)) {
        result.term_signal = WTERMSIG(status);
        result.exit_code = -1;
    }

    result.stdout_text = ReadFile(stdout_file);
    result.stderr_text = ReadFile(stderr_file);

    std::filesystem::remove(stdout_file);
    std::filesystem::remove(stderr_file);

    return result;
}
}  // namespace cherry::infra