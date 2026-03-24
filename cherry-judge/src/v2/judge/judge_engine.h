#pragma once

#include "model/types.h"

namespace cherry::v2::judge {

class JudgeEngine {
   public:
    virtual ~JudgeEngine() = default;
    virtual model::Verdict JudgeCase(const model::RunResult& run_result,
                                     const model::TestCaseSpec& tc) = 0;
    virtual void Aggregate(model::JudgeResult& result) = 0;
};

class ExactMatchJudgeEngine final : public JudgeEngine {
   public:
    model::Verdict JudgeCase(const model::RunResult& run_result,
                             const model::TestCaseSpec& tc) override;
    void Aggregate(model::JudgeResult& result) override;
};

}  // namespace cherry::v2::judge
