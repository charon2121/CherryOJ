#ifndef CHERRY_APP_JUDGE_PIPELINE_H_
#define CHERRY_APP_JUDGE_PIPELINE_H_

#include "domain/judge_result.h"
#include "domain/judge_task.h"
#include "execution/compiler.h"
#include "execution/runner.h"
#include "judge/judge_engine.h"
#include "store/result_store.h"

namespace cherry::app {

class JudgePipeline {
   public:
    JudgePipeline(const execution::Compiler* cpp_compiler,
                  const execution::Runner* cpp_runner,
                  const execution::Runner* python_runner,
                  const judge::JudgeEngine* judge_engine,
                  store::ResultStore* result_store);

    domain::JudgeResult Execute(const domain::JudgeTask& task) const;

   private:
    const execution::Compiler* cpp_compiler_;
    const execution::Runner* cpp_runner_;
    const execution::Runner* python_runner_;
    const judge::JudgeEngine* judge_engine_;
    store::ResultStore* result_store_;
};

}  // namespace cherry::app

#endif
