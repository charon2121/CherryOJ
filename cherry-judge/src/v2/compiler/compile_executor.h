#pragma once

#include "model/types.h"

namespace cherry::v2::compiler {

class CompileExecutor {
   public:
    virtual ~CompileExecutor() = default;
    virtual model::CompileResult Compile(const model::JudgeTask& task) = 0;
};

class MockCompileExecutor final : public CompileExecutor {
   public:
    model::CompileResult Compile(const model::JudgeTask& task) override;
};

}  // namespace cherry::v2::compiler
