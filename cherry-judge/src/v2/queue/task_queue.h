#pragma once

#include <optional>

#include "model/types.h"

namespace cherry::v2::queue {

class TaskQueue {
   public:
    virtual ~TaskQueue() = default;
    virtual bool Push(const model::JudgeTask& task) = 0;
    virtual std::optional<model::JudgeTask> PopBlocking() = 0;
    virtual size_t Size() const = 0;
};

}  // namespace cherry::v2::queue
