#include "judge/judge_engine.h"

namespace cherry::v2::judge {

model::Verdict ExactMatchJudgeEngine::JudgeCase(const model::RunResult& run_result,
                                                const model::TestCaseSpec& tc) {
    if (run_result.stdout_text == tc.expected_output) {
        return model::Verdict::kAccepted;
    }
    return model::Verdict::kWrongAnswer;
}

void ExactMatchJudgeEngine::Aggregate(model::JudgeResult& result) {
    result.total_cases = static_cast<int>(result.case_results.size());
    result.passed_cases = 0;
    result.total_score = 0;
    result.final_verdict = model::Verdict::kAccepted;
    for (const auto& r : result.case_results) {
        if (r.verdict == model::Verdict::kAccepted) {
            result.passed_cases++;
            result.total_score += 1;
        } else if (result.final_verdict == model::Verdict::kAccepted) {
            result.final_verdict = r.verdict;
        }
        result.total_time_ms += r.time_ms;
        result.peak_memory_kb = std::max(result.peak_memory_kb, r.memory_kb);
    }
    if (result.total_cases == 0) {
        result.final_verdict = model::Verdict::kSystemError;
    }
}

}  // namespace cherry::v2::judge
