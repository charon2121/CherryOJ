#include "dispatcher/Dispatcher.h"

#include "type/Type.h"

using namespace cherry;
using namespace cherry::dispatcher;

Dispatcher::Dispatcher() {}

Dispatcher::~Dispatcher() {}

void Dispatcher::Run() { eventLoop_.Loop(); }

void Dispatcher::Shutdown() { eventLoop_.Stop(); }

void Dispatcher::Submit(const SolutionId& solutionId) {
  if (runningWorkers_ >= maxConcurrentWorkers_) {  // worker 数量超过限制
    pendingQueue_.push(solutionId);
    return;
  }
}
