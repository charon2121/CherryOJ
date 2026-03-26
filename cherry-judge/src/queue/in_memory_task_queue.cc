#include "queue/in_memory_task_queue.h"

namespace cherry::queue {

bool InMemoryTaskQueue::Push(const domain::JudgeTask& task) {
    std::lock_guard<std::mutex> lock(mutex_);
    if (closed_) {
        return false;
    }
    queue_.push(task);
    cv_.notify_one();
    return true;
}

std::optional<domain::JudgeTask> InMemoryTaskQueue::PopBlocking() {
    std::unique_lock<std::mutex> lock(mutex_);
    cv_.wait(lock, [this] { return closed_ || !queue_.empty(); });

    if (queue_.empty()) {
        return std::nullopt;
    }

    auto task = queue_.front();
    queue_.pop();

    return task;
};

size_t InMemoryTaskQueue::Size() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return queue_.size();
}

void InMemoryTaskQueue::Close() {
    std::lock_guard<std::mutex> lock(mutex_);
    closed_ = true;
    cv_.notify_all();
}

}  // namespace cherry::queue