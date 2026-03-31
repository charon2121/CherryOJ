#include "app/judge_pipeline.h"

#include <optional>
#include <stdexcept>
#include <vector>

namespace cherry::app {
JudgePipeline::JudgePipeline(const execution::Compiler* cpp_compiler,
                             const execution::Runner* cpp_runner,
                             const execution::Runner* python_runner,
                             const judge::JudgeEngine* judge_engine,
                             store::ResultStore* result_store)
    : cpp_compiler_(cpp_compiler),
      cpp_runner_(cpp_runner),
      python_runner_(python_runner),
      judge_engine_(judge_engine),
      result_store_(result_store) {
    if (cpp_compiler_ == nullptr || cpp_runner_ == nullptr ||
        python_runner_ == nullptr || judge_engine_ == nullptr ||
        result_store_ == nullptr) {
        throw std::invalid_argument(
            "JudgePipeline dependencies cannot be null");
    }
}

domain::JudgeResult JudgePipeline::Execute(
    const domain::JudgeTask& task) const {
    std::optional<domain::CompileResult> compile_result;

    if (task.language == domain::Language::kCpp) {
        compile_result = cpp_compiler_->Compile(task);
        if (!compile_result->success) {  // compile error
            auto result = judge_engine_->Aggregate(task.submission_id,
                                                   compile_result, {});
            result_store_->Save(result);
            return result;
        }
    }

    std::vector<domain::RunResult> judged_results;
    judged_results.reserve(task.test_cases.size());

    for (const auto& test_case : task.test_cases) {
        domain::RunResult run_result;

        if (task.language == domain::Language::kCpp) {
            run_result =
                cpp_runner_->Run(task, test_case, &compile_result.value());
        } else {
            run_result = python_runner_->Run(task, test_case, nullptr);
        }

        auto judged = judge_engine_->JudgeCase(test_case, run_result);
        judged_results.push_back(judged);
    }

    auto result = judge_engine_->Aggregate(task.submission_id, compile_result,
                                           judged_results);
    result_store_->Save(result);
    return result;
}

}  // namespace cherry::app