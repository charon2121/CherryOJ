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

    //  
}

}  // namespace cherry::execution