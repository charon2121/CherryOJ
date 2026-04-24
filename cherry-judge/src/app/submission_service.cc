#include "app/submission_service.h"

#include <stdexcept>

#include "domain/judge_task.h"

namespace cherry::app {

SubmissionService::SubmissionService(store::SubmissionStore* submission_store,
                                     queue::TaskQueue* task_queue)
    : submission_store_(submission_store), task_queue_(task_queue) {
    if (submission_store_ == nullptr || task_queue_ == nullptr) {
        throw std::invalid_argument(
            "SubmissionService dependencies cannot be null");
    }
}

std::string SubmissionService::Submit(
    const domain::Submission& submission) const {
    submission_store_->Save(submission);
    auto task = BuildTask(submission);
    const bool pushed = task_queue_->Push(task);
    if (!pushed) {
        throw std::runtime_error("task queue is closed");
    }
    return task.task_id;
}

domain::JudgeTask SubmissionService::BuildTask(
    const domain::Submission& submission) {
    domain::JudgeTask task;
    task.task_id = submission.task_id.empty()
                       ? submission.submission_id + "-1"
                       : submission.task_id;
    task.submission_id = submission.submission_id;
    task.problem_id = submission.problem_id;
    task.language = submission.language;
    task.source_code = submission.source_code;
    task.limit = submission.limit;
    task.test_cases = submission.test_cases;
    task.callback_url = submission.callback_url;
    return task;
}

}  // namespace cherry::app
