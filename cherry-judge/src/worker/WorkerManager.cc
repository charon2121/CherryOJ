#include "WorkerManager.h"

#include <atomic>
#include <string>

#include "Worker.h"
#include "logger/Logger.h"
#include "type/Type.h"

using namespace cherry;
using namespace cherry::worker;

WorkerManager::WorkerManager(int worker_num)
    : target_worker_num_(worker_num) {};

WorkerManager::~WorkerManager() { this->Stop(); }

bool WorkerManager::IsRunning() const { return this->is_running_; }

int WorkerManager::CurrentWorkerNum() const {
  return this->current_worker_num_;
}
int WorkerManager::TargetWorkerNum() const { return this->target_worker_num_; }

WorkerId WorkerManager::NextId() {
  return "worker-" + std::to_string(this->next_id_++);
}

void WorkerManager::Start() {
  for (int i = 0; i < this->target_worker_num_; i++) {
    if (!CreateWorker()) {
      LOG_INFO("WorkManager", " create worker error!");
      return;
    }
  }
}

bool WorkerManager::saveWorkerInfo(WorkerId worker_id, pid_t pid) {
  auto [it, inserted] =
      worker_map_.emplace(worker_id, WorkerInfo{pid, WorkerStatus::kInit});
  if (inserted) {
    this->current_worker_num_++;
  }
  return inserted;
}

bool WorkerManager::CreateWorker() {
  if (this->current_worker_num_ >= this->target_worker_num_) {
    LOG_INFO("WorkerManager",
             "current worker num equal or bigger than target worker num.");
    return false;
  }

  WorkerId workerId = this->NextId();
  pid_t pid = fork();
  
  if (pid < 0) {
    LOG_INFO("WorkerManager", "pid < 0!");
    return false;
  } else if (pid == 0) {
    Worker worker(workerId);
    worker.Start();
    _exit(0);
  }
  this->saveWorkerInfo(workerId, pid);
  return true;
}
