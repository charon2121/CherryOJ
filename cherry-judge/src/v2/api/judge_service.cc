#include "api/judge_service.h"

#include <chrono>
#include <mutex>

namespace cherry::v2::api {

JudgeService::JudgeService(std::shared_ptr<queue::TaskQueue> queue) : queue_(std::move(queue)) {}

model::TaskId JudgeService::Submit(model::JudgeTask task) {
    if (task.task_id.empty()) {
        task.task_id = task.submission_id + "-attempt-" + std::to_string(task.attempt);
    }
    task.created_at = std::chrono::system_clock::now();
    queue_->Push(task);
    return task.task_id;
}

void JudgeService::SaveResult(const model::JudgeResult& result) {
    std::lock_guard<std::mutex> lock(mu_);
    results_[result.submission_id] = result;
}

std::optional<model::JudgeResult> JudgeService::GetResult(const model::SubmissionId& submission_id) const {
    std::lock_guard<std::mutex> lock(mu_);
    auto it = results_.find(submission_id);
    if (it == results_.end()) return std::nullopt;
    return it->second;
}

}  // namespace cherry::v2::api
