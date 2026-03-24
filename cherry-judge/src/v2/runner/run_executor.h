#pragma once

#include "model/types.h"

namespace cherry::v2::runner {

class RunExecutor {
   public:
    virtual ~RunExecutor() = default;
    virtual model::RunResult RunCase(const model::JudgeTask& task,
                                     const model::CompileResult& compile_result,
                                     const model::TestCaseSpec& tc) = 0;
};

class MockRunExecutor final : public RunExecutor {
   public:
    model::RunResult RunCase(const model::JudgeTask& task,
                             const model::CompileResult& compile_result,
                             const model::TestCaseSpec& tc) override;
};

}  // namespace cherry::v2::runner
