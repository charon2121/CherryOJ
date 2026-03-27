#ifndef CHERRY_EXECUTION_COMPILER_H_
#define CHERRY_EXECUTION_COMPILER_H_

#include "domain/compile_result.h"
#include "domain/judge_task.h"

namespace cherry::execution {
class Compiler {
   public:
    virtual ~Compiler() = default;
    virtual domain::CompileResult Compile(
        const domain::JudgeTask& task) const = 0;
};
}  // namespace cherry::execution

#endif
