#include "Worker.h"

#include <future>
#include <string>

#include "logger/Logger.h"

using namespace cherry;
using namespace cherry::worker;

Worker::Worker(WorkerId worker_id) : worker_id_(worker_id) {};

Worker::~Worker() { this->Stop(); }

void Worker::Start() {
  LOG_INFO("worker", this->worker_id_ + " started...");
  std::promise<void> promise;
  auto future = promise.get_future();
  // 阻塞线程
  future.wait();
}

void Worker::Stop() {
  LOG_INFO("worker", this->worker_id_ + " executed stop...");
};
