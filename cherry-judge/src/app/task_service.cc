#include "app/task_service.h"

#include <stdexcept>

namespace cherry::app {

TaskService::TaskService(queue::TaskQueue* task_queue,
                         const JudgePipeline* judge_pipeline)
    : task_queue_(task_queue), judge_pipeline_(judge_pipeline) {
    if (task_queue_ == nullptr || judge_pipeline_ == nullptr) {
        throw std::invalid_argument("TaskService dependencies cannot be null");
    }
}

TaskService::~TaskService() { Stop(); }

void TaskService::Start() {
    if (running_.exchange(true)) {
        return;
    }

    worker_thread_ = std::thread(&TaskService::Loop, this);
}

void TaskService::Stop() {
    if (!running_.exchange(false)) {
        return;
    }

    task_queue_->Close();
    if (worker_thread_.joinable()) {
        worker_thread_.join();
    }
}

void TaskService::Loop() {
    while (running_) {
        auto task = task_queue_->PopBlocking();
        if (!task.has_value()) {
            if (!running_) {
                break;
            }
            continue;
        }
        judge_pipeline_->Execute(task.value());
    }
}

}  // namespace cherry::app
