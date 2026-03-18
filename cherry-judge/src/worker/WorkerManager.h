#ifndef CHERRY_WORKER_WORKER_MANAGER_H_
#define CHERRY_WORKER_WORKER_MANAGER_H_

#include <unistd.h>

#include <atomic>
#include <unordered_map>

#include "type/Type.h"

namespace cherry {
namespace worker {

enum class WorkerStatus { kUnknown = 0, kInit, kIdle, kRunning, kStopped };

struct WorkerInfo {
    pid_t pid = -1;  // worker 进程 ID
    WorkerStatus worker_status = WorkerStatus::kUnknown;
};

/**
 * WorkerManager 类
 */
class WorkerManager {
   public:
    explicit WorkerManager(int worker_num);
    ~WorkerManager();

    WorkerManager(const WorkerManager&) = delete;
    WorkerManager& operator=(const WorkerManager&) = delete;

    bool Start();  // 启动
    void Stop();   // 关闭

    bool IsRunning() const;
    int CurrentWorkerNum() const;  // 当前 worker 数量
    int TargetWorkerNum() const;   //  目标 worker 数量

    // bool StopWorker(WorkerId worker_id);
    // bool RestartWorker(WorkerId worker_id);

    // int ScaleTo(int worker_num);

   private:
    WorkerId NextId();                                   // 分配 ID
    bool CreateWorker();                                 // 创建 Worker 进程
    bool DestroyWorker(WorkerId worker_id);              // 摧毁 Worker 进程
    bool SaveWorkerInfo(WorkerId worker_id, pid_t pid);  // 保存进程信息

   private:
    std::unordered_map<WorkerId, WorkerInfo>
        worker_map_;               // 保存 workerInfo 对象
    std::atomic<int> next_id_{1};  // 负责生成 ID
    int target_worker_num_ = 0;    // 目标 worker 数量
    bool is_running_ = false;      // 运行状态
};

}  // namespace worker
}  // namespace cherry

#endif
