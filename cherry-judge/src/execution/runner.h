#ifndef CHERRY_EXECUTION_RUNNER_H_
#define CHERRY_EXECUTION_RUNNER_H_

#include "domain/compile_result.h"
#include "domain/judge_task.h"
#include "domain/run_result.h"

namespace cherry::execution {
class Runner {
   public:
    virtual ~Runner() = default;

    virtual domain::RunResult Run(
        const domain::JudgeTask& task, const domain::TestCase& test_case,
        const domain::CompileResult* compile_result) const = 0;
};
}  // namespace cherry::execution

#endif
