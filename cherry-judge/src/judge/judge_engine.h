#ifndef CHERRY_JUDGE_JUDGE_ENGINE_H_
#define CHERRY_JUDGE_JUDGE_ENGINE_H_

#include <memory>
#include <optional>
#include <string>
#include <vector>

#include "domain/compile_result.h"
#include "domain/judge_result.h"
#include "domain/run_result.h"
#include "domain/test_case.h"
#include "judge/output_checker.h"

namespace cherry::judge {

class JudgeEngine {
   public:
    explicit JudgeEngine(std::shared_ptr<OutputChecker> output_checker);

    domain::RunResult JudgeCase(const domain::TestCase& test_case,
                                domain::RunResult run_result) const;

    domain::JudgeResult Aggregate(
        const std::string& submission_id,
        const std::optional<domain::CompileResult>& compile_result,
        const std::vector<domain::RunResult>& run_results) const;

   private:
    std::shared_ptr<OutputChecker> output_checker_;
};

}  // namespace cherry::judge

#endif