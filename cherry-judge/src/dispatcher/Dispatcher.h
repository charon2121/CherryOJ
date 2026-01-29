#ifndef CHERRY_DISPATCHER_DISPATCHER_H_
#define CHERRY_DISPATCHER_DISPATCHER_H_

#include <queue>
#include <string>

namespace cherry {
namespace dispatcher {

using SolutionId = std::string;
using WorkerId = std::string;
/**
 * 系统中常驻的进程
 * 负责接收判题任务、创建 Worker 进程进行判题
 */
class Dispatcher {
 public:
  Dispatcher();
  ~Dispatcher();

  // 启动 Dispatcher
  void Run();

  // 关闭 Dispatcher
  void Shutdown();

  // 接收用户提交的 SolutionId
  void Submit(const SolutionId& soluctionId);

 private:
  // 启动新的 Worker 进程
  void SpawnWorker(SolutionId solutionId);
  
  // 清理 Worker 进程
  void removeWorker(WorkerId workerId);
 private:
  // 等待调度的用户提交
  std::queue<SolutionId> pendingQueue_;

  // 运行标志
  bool shuttingDown_;

  // Worker 并发数
  int64_t maxConcurrentWorkers_;
  int64_t runningWorkers_;

  // WorkerId 生成器
  WorkerId nextWorkerId_;
};

}  // namespace dispatcher
}  // namespace cherry

#endif
