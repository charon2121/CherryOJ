#ifndef CHERRY_QUEUE_IN_MEMORY_TASK_QUEUE_H_
#define CHERRY_QUEUE_IN_MEMORY_TASK_QUEUE_H_

#include <condition_variable>
#include <cstddef>
#include <mutex>
#include <optional>
#include <queue>

#include "queue/task_queue.h"

namespace cherry::queue {
class InMemoryTaskQueue final : public TaskQueue {
   public:
    bool Push(const domain::JudgeTask& task) override;
    std::optional<domain::JudgeTask> PopBlocking() override;
    size_t Size() const override;
    void Close() override;

   private:
    mutable std::mutex mutex_;
    std::condition_variable cv_;
    std::queue<domain::JudgeTask> queue_;
    bool closed_ = false;
};
}  // namespace cherry::queue

#endif
