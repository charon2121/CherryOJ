#include "execution/cpp_compiler.h"

#include <filesystem>
#include <fstream>
#include <vector>

namespace cherry::execution {

CppCompiler::CppCompiler(infra::WorkspaceManager workspace_manager,
                         infra::ProcessExecutor process_executor,
                         int64_t compile_timeout_ms)
    : workspace_manager_(std::move(workspace_manager)),
      process_executor_(std::move(process_executor)),
      compile_timeout_ms_(compile_timeout_ms) {}

domain::CompileResult CppCompiler::Compile(
    const domain::JudgeTask& task) const {
    domain::CompileResult result;

    if (task.language != domain::Language::kCpp) {
        result.success = false;
        result.exit_code = -1;
        result.stderr_text = "CppCompiler only supports Language::kCpp";
        return result;
    }

    const auto source_path =
        workspace_manager_.SourceFilePath(task.submission_id, task.language);

    const auto executable_path =
        workspace_manager_.ExecutablePath(task.submission_id);

    std::ofstream ofs(source_path);
    ofs << task.source_code;
    ofs.close();

    if (!ofs.good() && !std::filesystem::exists(source_path)) {
        result.success = false;
        result.exit_code = -1;
        result.stderr_text = "failed to write source file";
        return result;
    }

    std::vector<std::string> argv = {"g++", "-std=c++17",
                                     "-O2", source_path.string(),
                                     "-o",  executable_path.string()};

    //
    auto process_result = process_executor_.Run(
        argv, "", compile_timeout_ms_, source_path.parent_path().string());

    result.exit_code = process_result.exit_code;
    result.time_ms = process_result.elapsed_ms;
    result.memory_kb = 0;
    result.stdout_text = process_result.stdout_text;
    result.stderr_text = process_result.stderr_text;
    result.executable_path = executable_path.string();

    if (process_result.timed_out) {
        result.success = false;
        if (!result.stderr_text.empty()) {
            result.stderr_text += "\n";
        }
        result.stderr_text += "compile timed out";
        return result;
    }

    result.success = (process_result.exit_code == 0 &&
                      std::filesystem::exists(executable_path));
    return result;
}

}  // namespace cherry::execution
