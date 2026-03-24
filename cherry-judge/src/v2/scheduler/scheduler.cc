#include "scheduler/scheduler.h"

#include <memory>

#include "queue/in_memory_task_queue.h"

namespace cherry::v2::scheduler {

Scheduler::Scheduler(std::shared_ptr<queue::TaskQueue> queue,
                     std::shared_ptr<worker::WorkerClient> worker_client)
    : queue_(std::move(queue)), worker_client_(std::move(worker_client)) {}

Scheduler::~Scheduler() { Stop(); }

void Scheduler::Start() {
    if (running_.exchange(true)) return;
    loop_thread_ = std::thread(&Scheduler::DispatchLoop, this);
}

void Scheduler::Stop() {
    if (!running_.exchange(false)) return;
    if (auto mem_queue = std::dynamic_pointer_cast<queue::InMemoryTaskQueue>(queue_)) {
        mem_queue->Close();
    }
    if (loop_thread_.joinable()) loop_thread_.join();
}

void Scheduler::DispatchLoop() {
    while (running_) {
        auto task = queue_->PopBlocking();
        if (!task.has_value()) {
            if (!running_) break;
            continue;
        }
        worker_client_->Submit(task.value());
    }
}

}  // namespace cherry::v2::scheduler
