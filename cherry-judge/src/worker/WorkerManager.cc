#include "worker/WorkerManager.h"

#include <signal.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

#include <atomic>
#include <vector>
#include <cerrno>
#include <csignal>

#include "worker/Worker.h"
#include "common/logger/Logger.h"
#include "types/Type.h"

using namespace cherry;
using namespace cherry::worker;

/**
 * 构造 / 析构
 */
WorkerManager::WorkerManager(int worker_num)
    : target_worker_num_(worker_num > 0 ? worker_num : 0) {};
WorkerManager::~WorkerManager() { Stop(); }

bool WorkerManager::IsRunning() const { return is_running_; }
int WorkerManager::CurrentWorkerNum() const { return worker_map_.size(); }
int WorkerManager::TargetWorkerNum() const { return target_worker_num_; }
WorkerId WorkerManager::NextId() {
    return "worker-" + std::to_string(next_id_++);
}

bool WorkerManager::Start() {
    if (is_running_) return true;

    if (target_worker_num_ <= 0) {
        is_running_ = true;
        return true;
    }

    for (int i = 0; i < target_worker_num_; i++) {
        if (!CreateWorker()) {
            LOG_INFO("WorkManager", " create worker error!");
            return false;
        }
    }

    is_running_ = true;
    return true;
}

void WorkerManager::Stop() {
    if (!is_running_ && worker_map_.empty()) {
        return;
    }

    std::vector<WorkerId> worker_ids;
    worker_ids.reserve(worker_map_.size());

    for (const auto& entry : worker_map_) {
        worker_ids.push_back(entry.first);
    }

    for (WorkerId worker_id : worker_ids) {
        DestroyWorker(worker_id);
    }

    worker_map_.clear();
    is_running_ = false;
}

bool WorkerManager::SaveWorkerInfo(WorkerId worker_id, pid_t pid) {
    auto [it, inserted] =
        worker_map_.emplace(worker_id, WorkerInfo{pid, WorkerStatus::kInit});
    return inserted;
}

bool WorkerManager::CreateWorker() {
    if (CurrentWorkerNum() >= target_worker_num_) {
        LOG_INFO("WorkerManager",
                 "current worker num equal or bigger than target worker num.");
        return false;
    }
    WorkerId workerId = NextId();
    pid_t pid = fork();
    
    if (pid < 0) {
        LOG_INFO("WorkerManager", "pid < 0!");
        return false;
    } else if (pid == 0) {
        Worker worker(workerId);
        worker.Start();
        _exit(0);
    }
    SaveWorkerInfo(workerId, pid);
    return true;
}

bool WorkerManager::DestroyWorker(WorkerId worker_id) {
    auto it = worker_map_.find(worker_id);
    if (it == worker_map_.end()) {
        return false;
    }

    pid_t pid = it->second.pid;
    if (pid <= 0) {
        worker_map_.erase(it);
        return false;
    }

    if (::kill(pid, SIGTERM) != 0) {
        if (errno != ESRCH) { // 进程已经不存在
            return false;
        }
    }

    int status = 0;
    if (::waitpid(pid, &status, 0) < 0) {
        if (errno != ECHILD) {
            return false;
        }
    }

    worker_map_.erase(it);
    return true;
}
