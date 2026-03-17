#ifndef CHERRY_WORKER_WORKER_MANAGER_H_
#define CHERRY_WORKER_WORKER_MANAGER_H_

#include <unistd.h>

#include <atomic>
#include <unordered_map>

#include "type/Type.h"

namespace cherry {
namespace worker {

enum class WorkerStatus { kUnknown = 0, kInit, kIdle, kRunning, kStoped };

struct WorkerInfo {
  pid_t pid = -1;  // worker 进程 ID
  WorkerStatus workerStatus;
};

/**
 * WorkerManager 类
 */
class WorkerManager {
 public:
  explicit WorkerManager(int worker_num);
  ~WorkerManager();

  void Start();  // 启动
  void Stop();   // 关闭

  bool IsRunning() const;
  int CurrentWorkerNum() const;  // 当前 worker 数量
  int TargetWorkerNum() const;   //  目标 worker 数量

  bool StopWorker(WorkerId worker_id);
  bool RestartWorker(WorkerId worker_id);

  int ScaleTo(int worker_num);  // 将 Worker 的数量调整至 worker_num 个

 private:
  WorkerId NextId();                                   // 分配 ID
  bool CreateWorker();                                 // 创建 Worker 进程
  bool DestoryWorker(WorkerId worker_id);              // 摧毁 Worker 进程
  bool saveWorkerInfo(WorkerId worker_id, pid_t pid);  // 保存进程信息

 private:
  std::unordered_map<WorkerId, WorkerInfo> worker_map_;  // 保存 workerInfo 对象
  std::atomic<int> next_id_{1};                          // 负责生成 ID
  int current_worker_num_;                               // 当前的 worker 数量
  int target_worker_num_;                                // 目标 worker 数量
  bool is_running_ = false;                              // 运行状态
};

}  // namespace worker
}  // namespace cherry

#endif
