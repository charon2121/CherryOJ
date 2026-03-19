#ifndef CHERRY_COMMON_EVENT_QUEUE_H
#define CHERRY_COMMON_EVENT_QUEUE_H

#include <condition_variable>
#include <mutex>
#include <queue>

#include "common/event/Event.h"

namespace cherry {
namespace common {

class EventQueue {
   public:
    EventQueue() = default;
    EventQueue(const EventQueue&) = delete;
    EventQueue& operator=(const EventQueue&) = delete;

    void Push(const Event& event);
    Event Take();

   private:
    std::mutex mutex_;
    std::condition_variable cv_;
    std::queue<Event> queue_;
};

}  // namespace common
}  // namespace cherry

#endif