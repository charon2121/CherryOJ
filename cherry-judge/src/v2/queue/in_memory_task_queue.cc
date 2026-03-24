#include "queue/in_memory_task_queue.h"

namespace cherry::v2::queue {

bool InMemoryTaskQueue::Push(const model::JudgeTask& task) {
    std::lock_guard<std::mutex> lock(mu_);
    if (closed_) return false;
    q_.push(task);
    cv_.notify_one();
    return true;
}

std::optional<model::JudgeTask> InMemoryTaskQueue::PopBlocking() {
    std::unique_lock<std::mutex> lock(mu_);
    cv_.wait(lock, [this] { return closed_ || !q_.empty(); });
    if (q_.empty()) return std::nullopt;
    auto task = q_.front();
    q_.pop();
    return task;
}

size_t InMemoryTaskQueue::Size() const {
    std::lock_guard<std::mutex> lock(mu_);
    return q_.size();
}

void InMemoryTaskQueue::Close() {
    std::lock_guard<std::mutex> lock(mu_);
    closed_ = true;
    cv_.notify_all();
}

}  // namespace cherry::v2::queue
