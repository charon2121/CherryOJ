#include "execution/cpp_runner.h"

#include <filesystem>
#include <vector>

namespace cherry::execution {

CppRunner::CppRunner(infra::ProcessExecutor process_executor,
                     int64_t run_timeout_ms)
    : process_executor_(std::move(process_executor)),
      run_timeout_ms_(run_timeout_ms) {}

domain::RunResult CppRunner::Run(
    const domain::JudgeTask& task, const domain::TestCase& test_case,
    const domain::CompileResult* compile_result) const {
    domain::RunResult result;

    result.case_id = test_case.case_id;

    if (compile_result == nullptr ||
        compile_result->executable_path.empty()) {  // compiler error
        result.verdict = domain::Verdict::kRuntimeError;
        result.stderr_text = "missing executable path";
        return result;
    }

    if (!std::filesystem::exists(compile_result->executable_path)) {
        result.verdict = domain::Verdict::kRuntimeError;
        result.stderr_text = "executable does not exist";
        return result;
    }

    std::vector<std::string> argv = {compile_result->executable_path};

    auto process_result = process_executor_.Run(argv, test_case.input, run_timeout_ms_);

    result.exit_code = process_result.exit_code;
    result.signal = process_result.term_signal;
    result.time_ms = process_result.elapsed_ms;
    result.memory_kb = 0; // TODO: 统计进程的内存占用
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