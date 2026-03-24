#pragma once

#include <condition_variable>
#include <mutex>
#include <optional>
#include <queue>

#include "queue/task_queue.h"

namespace cherry::v2::queue {

class InMemoryTaskQueue final : public TaskQueue {
   public:
    bool Push(const model::JudgeTask& task) override;
    std::optional<model::JudgeTask> PopBlocking() override;
    size_t Size() const override;
    void Close();

   private:
    mutable std::mutex mu_;
    std::condition_variable cv_;
    std::queue<model::JudgeTask> q_;
    bool closed_ = false;
};

}  // namespace cherry::v2::queue
