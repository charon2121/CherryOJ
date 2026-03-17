#include "Worker.h"

#include <string>

#include "logger/Logger.h"

using namespace cherry;
using namespace cherry::worker;

Worker::Worker(WorkerId worker_id) : worker_id_(worker_id) {};

Worker::~Worker() {
  this->Stop();
}

void Worker::Start() {
  LOG_INFO("worker", this->worker_id_ + " started...");
  while (1) {
  }
}

void Worker::Stop() {
  LOG_INFO("worker", this->worker_id_ + " executed stop...");
};
