#ifndef CHERRY_APP_SUBMISSION_SERVICE_H_
#define CHERRY_APP_SUBMISSION_SERVICE_H_

#include <string>

#include "domain/judge_task.h"
#include "domain/submission.h"
#include "queue/task_queue.h"
#include "store/submission_store.h"

namespace cherry::app {

class SubmissionService {
   public:
    SubmissionService(store::SubmissionStore* submission_store,
                      queue::TaskQueue* task_queue);

    std::string Submit(const domain::Submission& submission) const;

   private:
    static domain::JudgeTask BuildTask(const domain::Submission& submission);

   private:
    store::SubmissionStore* submission_store_;
    queue::TaskQueue* task_queue_;
};

}  // namespace cherry::app

#endif
