#include "common/event/EventQueue.h"

using namespace cherry;
using namespace cherry::common;

// TODO:
void EventQueue::Push(const Event& event) {
    {
        std::lock_guard<std::mutex> lock(mutex_);
        queue_.push(event);
    }
    cv_.notify_one();
}

Event EventQueue::Take() {
    std::unique_lock<std::mutex> lock(mutex_);
    cv_.wait(lock, [this] { return !queue_.empty(); });
    Event event = std::move(queue_.front());
    queue_.pop();
    return event;
}
