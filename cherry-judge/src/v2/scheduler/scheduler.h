#pragma once

#include <atomic>
#include <memory>
#include <thread>

#include "queue/task_queue.h"
#include "worker/worker_client.h"

namespace cherry::v2::scheduler {

class Scheduler {
   public:
    Scheduler(std::shared_ptr<queue::TaskQueue> queue,
              std::shared_ptr<worker::WorkerClient> worker_client);
    ~Scheduler();

    void Start();
    void Stop();

   private:
    void DispatchLoop();

   private:
    std::shared_ptr<queue::TaskQueue> queue_;
    std::shared_ptr<worker::WorkerClient> worker_client_;
    std::atomic<bool> running_{false};
    std::thread loop_thread_;
};

}  // namespace cherry::v2::scheduler
