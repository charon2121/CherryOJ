#ifndef CHERRY_COMMON_EVENT_H
#define CHERRY_COMMON_EVENT_H

#include <variant>

#include "types/Type.h"

namespace cherry {
namespace common {

// 事件类型
enum class EventType {
    kSubmit,         // 提交事件
    kJudgeFinished,  // 判题完成事件
};

struct SubmitEvent {
    SolutionId solutionId;
};

struct Event {
    EventType type;
};

}  // namespace common
}  // namespace cherry

#endif
