#include "sandbox.h"
#include <iostream>
#include <fstream>
#include <cstdlib>
#include <sys/resource.h>
#include <sys/wait.h>
#include <unistd.h>
#include <sys/mount.h>
#include "../config/config.h"
#include <sys/stat.h>

void Sandbox::initSandbox() {

    // 创建新的挂载命令空间
    if (unshare(CLONE_NEWNS) != 0) {
        perror("unshare(CLONE_NEWNS) failed");
        exit(1);
    }

    // 表示将挂载点设置为private模式，后续挂载或卸载操作不再对外传播。
    if (mount("none", "/", NULL, MS_REC | MS_PRIVATE, NULL) != 0) {
        perror("mount MS_REC|MS_PRIVATE failed");
        exit(1);
    }

    // 创建沙箱内的目录
    std::string sandbox_dir = Config::SANDBOX_DIR;
    mkdir(sandbox_dir.c_str(), 0755);
    mkdir(Config::LIB_DIR.c_str(), 0755);
    mkdir(Config::USR_DIR.c_str(), 0755);
    mkdir(Config::USR_LIB_DIR.c_str(), 0755);
    mkdir(Config::USR_LIB64_DIR.c_str(), 0755);
    mkdir(Config::USR_INCLUDE_DIR.c_str(), 0755);

    // 使用 mount 系统调用挂载必要的系统文件，并设置为只读
    if (mount("/lib", Config::LIB_DIR.c_str(), NULL, MS_BIND, NULL) != 0) {
        perror("Error mounting /lib");
    }
    if (mount("/usr/lib", Config::USR_LIB_DIR.c_str(), NULL, MS_BIND, NULL) != 0) {
        perror("Error mounting /usr/lib");
    }
    if (mount("/usr/lib64", Config::USR_LIB64_DIR.c_str(), NULL, MS_BIND, NULL) != 0) {
        perror("Error mounting /usr/lib64");
    }
    if (mount("/usr/include", Config::USR_INCLUDE_DIR.c_str(), NULL, MS_BIND, NULL) != 0) {
        perror("Error mounting /usr/include");
    }

    // 设置为只读
    // if (mount(NULL, Config::LIB_DIR.c_str(), NULL, MS_REMOUNT | MS_RDONLY, NULL) != 0) {
    //     perror("Error remounting /lib as read-only");
    // }
    // if (mount(NULL, Config::USR_LIB_DIR.c_str(), NULL, MS_REMOUNT | MS_RDONLY, NULL) != 0) {
    //     perror("Error remounting /usr/lib as read-only");
    // }
    // if (mount(NULL, Config::USR_LIB64_DIR.c_str(), NULL, MS_REMOUNT | MS_RDONLY, NULL) != 0) {
    //     perror("Error remounting /usr/lib64 as read-only");
    // }
    // if (mount(NULL, Config::USR_INCLUDE_DIR.c_str(), NULL, MS_REMOUNT | MS_RDONLY, NULL) != 0) {
    //     perror("Error remounting /usr/include as read-only");
    // }
}

void Sandbox::setResourceLimits(int time_limit_ms, int memory_limit_kb) {
    max_time_limit_ms = time_limit_ms;
    max_memory_limit_kb = memory_limit_kb;
}

bool Sandbox::compile(const Task& task) {
    if (task.solution.language == Language::PYTHON_3) {
        // Python 不需要编译
        return true;
    }
    return doCompile(task);
}

SandboxResult Sandbox::run(const Task& task) {
    return doRun(task);
}

bool Sandbox::doCompile(const Task& task) {
    const LanguageInfo* lang_info = LanguageManager::get_language_info(task.solution.language);
    if (!lang_info) {
        std::cerr << "Unsupported language" << std::endl;
        return false;
    }

    std::string compile_cmd = lang_info->versions[0].compile_cmd;
    std::string source_file = Config::SANDBOX_DIR + "/" + task.task_id + "/source" + lang_info->file_extension;
    std::string output_file = Config::SANDBOX_DIR + "/" + task.task_id + "/output";

    // 写入源代码到文件
    std::ofstream source_out(source_file);
    source_out << task.solution.source_code;
    source_out.close();

    // 替换命令中的占位符
    compile_cmd.replace(compile_cmd.find("{source}"), 8, source_file);
    compile_cmd.replace(compile_cmd.find("{output}"), 8, output_file);

    // 执行编译命令
    int result = std::system(compile_cmd.c_str());
    return result == 0;
}

SandboxResult Sandbox::doRun(const Task& task) {
    SandboxResult result;
    const LanguageInfo* lang_info = LanguageManager::get_language_info(task.solution.language);
    if (!lang_info) {
        std::cerr << "Unsupported language" << std::endl;
        result.killed_by_sandbox = true;
        return result;
    }

    std::string run_cmd = lang_info->versions[0].run_cmd;
    std::string output_file = Config::SANDBOX_DIR + "/" + task.task_id + "/output";

    // 替换命令中的占位符
    run_cmd.replace(run_cmd.find("{output}"), 8, output_file);

    // 使用 fork 和 exec 执行命令
    pid_t pid = fork();
    if (pid == 0) {
        // 子进程
        chroot((Config::SANDBOX_DIR + "/" + task.task_id).c_str());
        chdir("/");

        struct rlimit rl;
        rl.rlim_cur = max_time_limit_ms / 1000;
        rl.rlim_max = max_time_limit_ms / 1000;
        setrlimit(RLIMIT_CPU, &rl);

        rl.rlim_cur = max_memory_limit_kb * 1024;
        rl.rlim_max = max_memory_limit_kb * 1024;
        setrlimit(RLIMIT_AS, &rl);

        execl("/bin/sh", "sh", "-c", run_cmd.c_str(), (char*)NULL);
        _exit(127); // exec 失败
    } else if (pid > 0) {
        // 父进程
        int status;
        waitpid(pid, &status, 0);
        if (WIFEXITED(status)) {
            result.exit_code = WEXITSTATUS(status);
        } else if (WIFSIGNALED(status)) {
            result.killed_by_sandbox = true;
        }
    } else {
        // fork 失败
        std::cerr << "Failed to fork process" << std::endl;
        result.killed_by_sandbox = true;
    }

    return result;
}