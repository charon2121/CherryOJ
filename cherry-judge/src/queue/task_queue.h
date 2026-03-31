#ifndef CHERRY_QUEUE_TASK_QUEUE_H_
#define CHERRY_QUEUE_TASK_QUEUE_H_

#include <cstddef>
#include <optional>

#include "domain/judge_result.h"
#include "domain/judge_task.h"

namespace cherry::queue {

class TaskQueue {
   public:
    virtual ~TaskQueue() = default;

    virtual bool Push(const domain::JudgeTask& task);

    virtual std::optional<domain::JudgeTask> PopBlocking() = 0;

    virtual size_t Size() const = 0;

    virtual void Close() = 0;
};
}  // namespace cherry::queue

#endif
