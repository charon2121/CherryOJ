#ifndef CHERRY_APP_TASK_SERVICE_H_
#define CHERRY_APP_TASK_SERVICE_H_

#include <atomic>
#include <thread>

#include "app/judge_pipeline.h"
#include "app/webhook_client.h"
#include "queue/task_queue.h"

namespace cherry::app {

class TaskService {
   public:
    TaskService(queue::TaskQueue* task_queue,
                const JudgePipeline* judge_pipeline,
                const WebhookClient* webhook_client);
    ~TaskService();

    void Start();
    void Stop();

   private:
    void Loop();

   private:
    queue::TaskQueue* task_queue_;
    const JudgePipeline* judge_pipeline_;
    const WebhookClient* webhook_client_;
    std::atomic<bool> running_{false};
    std::thread worker_thread_;
};

}  // namespace cherry::app

#endif
