#include "common/event/EventLoop.h"

using namespace cherry;
using namespace cherry::common;

void EventLoop::Loop() {
    running_ = true;
    while (running_) {
        Event e = eventQueue_.Take();
        // 处理 event
    }
}

void EventLoop::Stop() { running_ = false; }