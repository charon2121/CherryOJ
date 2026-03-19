#ifndef CHERRY_COMMON_EVENT_LOOP_H
#define CHERRY_COMMON_EVENT_LOOP_H

#include "common/event/EventQueue.h"

namespace cherry {
namespace common {
class EventLoop {
   public:
    EventLoop() = default;

    void Loop();
    void Stop();

   private:
    EventQueue eventQueue_;
    bool running_;
};
}  // namespace common
}  // namespace cherry

#endif
