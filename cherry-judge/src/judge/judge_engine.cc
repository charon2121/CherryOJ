#include "judge/judge_engine.h"

namespace cherry::judge {

JudgeEngine::JudgeEngine(std::shared_ptr<OutputChecker> output_checker)
    : output_checker_(std::move(output_checker)) {};

domain::RunResult JudgeEngine::JudgeCase(const domain::TestCase& test_case,
                                         domain::RunResult run_result) const {
    if (run_result.verdict == domain::Verdict::kTimeLimitExceeded ||
        run_result.verdict == domain::Verdict::kRuntimeError) {
        return run_result;
    }

    if (output_checker_ != nullptr &&
        output_checker_->IsMatch(test_case.expected_output,
                                 run_result.stdout_text)) {
        run_result.verdict = domain::Verdict::kAccepted;
    } else {
        run_result.verdict = domain::Verdict::kWrongAnswer;
    }

    return run_result;
};

domain::JudgeResult JudgeEngine::Aggregate(
    const std::string& submission_id,
    const std::optional<domain::CompileResult>& compile_result,
    const std::vector<domain::RunResult>& run_results) const {
    domain::JudgeResult result;

    result.submission_id = submission_id;
    result.compile_result = compile_result;

    result.run_results = run_results;
    result.total_cases = static_cast<int>(run_results.size());

    result.passed_cases = 0;
    result.total_time_ms = 0;
    result.peak_memory_kb = 0;

    if (compile_result.has_value() && !compile_result->success) {
        result.final_verdict = domain::Verdict::kCompilationError;
        result.message = "compilation error";
        return result;
    }

    result.final_verdict = domain::Verdict::kAccepted;
    for (const auto& run_result : run_results) {
        result.total_time_ms += run_result.time_ms;
        result.peak_memory_kb =
            std::max(result.peak_memory_kb, run_result.memory_kb);

        if (run_result.verdict == domain::Verdict::kAccepted) {
            result.passed_cases += 1;
            continue;
        }

        result.final_verdict = run_result.verdict;
        break;
    }

    if (run_results.empty()) {
        result.final_verdict = domain::Verdict::kSystemError;
        result.message = "no run results";
    }

    return result;
}

}  // namespace cherry::judge
