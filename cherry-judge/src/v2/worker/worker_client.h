#pragma once

#include "model/types.h"

namespace cherry::v2::worker {

class WorkerClient {
   public:
    virtual ~WorkerClient() = default;
    virtual bool Submit(const model::JudgeTask& task) = 0;
};

}  // namespace cherry::v2::worker
