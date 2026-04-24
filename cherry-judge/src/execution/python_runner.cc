#include "execution/python_runner.h"

#include <filesystem>
#include <fstream>
#include <vector>

namespace cherry::execution {

PythonRunner::PythonRunner(infra::WorkspaceManager workspace_manager,
                           infra::ProcessExecutor process_executor,
                           int64_t run_timeout_ms)
    : workspace_manager_(std::move(workspace_manager)),
      process_executor_(std::move(process_executor)),
      run_timeout_ms_(run_timeout_ms) {}

domain::RunResult PythonRunner::Run(const domain::JudgeTask& task,
                                    const domain::TestCase& test_case,
                                    const domain::CompileResult*) const {
    domain::RunResult result;

    result.case_id = test_case.case_id;
    result.case_no = test_case.case_no;

    const auto source_path = workspace_manager_.SourceFilePath(
        task.submission_id, domain::Language::kPython);

    std::ofstream ofs(source_path);
    ofs << task.source_code;
    ofs.close();

    std::vector<std::string> argv = {"python3", source_path.string()};

    const int64_t timeout_ms =
        task.limit.time_limit_ms > 0 ? task.limit.time_limit_ms : run_timeout_ms_;
    auto process_result = process_executor_.Run(
        argv, test_case.input, timeout_ms, source_path.parent_path().string());

    result.exit_code = process_result.exit_code;
    result.signal = process_result.term_signal;
    result.time_ms = process_result.elapsed_ms;
    result.memory_kb = 0;  // TODO: 统计内存花销
    result.stdout_text = process_result.stdout_text;
    result.stderr_text = process_result.stderr_text;

    if (process_result.timed_out) {
        result.verdict = domain::Verdict::kTimeLimitExceeded;
    } else if (process_result.exit_code == 0) {
        result.verdict = domain::Verdict::kPending;
    } else {
        result.verdict = domain::Verdict::kRuntimeError;
    }
    return result;
}

}  // namespace cherry::execution
