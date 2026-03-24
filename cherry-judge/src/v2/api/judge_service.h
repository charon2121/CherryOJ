#pragma once

#include <memory>
#include <mutex>
#include <optional>
#include <string>
#include <unordered_map>

#include "model/types.h"
#include "queue/task_queue.h"

namespace cherry::v2::api {

class JudgeService {
   public:
    explicit JudgeService(std::shared_ptr<queue::TaskQueue> queue);

    model::TaskId Submit(model::JudgeTask task);
    void SaveResult(const model::JudgeResult& result);
    std::optional<model::JudgeResult> GetResult(const model::SubmissionId& submission_id) const;

   private:
    std::shared_ptr<queue::TaskQueue> queue_;
    mutable std::mutex mu_;
    std::unordered_map<model::SubmissionId, model::JudgeResult> results_;
};

}  // namespace cherry::v2::api
