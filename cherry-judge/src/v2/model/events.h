#pragma once

#include <chrono>
#include <string>

#include "model/types.h"

namespace cherry::v2::model {

enum class EventType {
    kTaskCreated,
    kTaskDispatched,
    kTaskStarted,
    kCompileStarted,
    kCompileFinished,
    kCaseStarted,
    kCaseFinished,
    kTaskFinished,
    kTaskFailed,
};

struct JudgeEvent {
    EventType type;
    TaskId task_id;
    SubmissionId submission_id;
    TraceId trace_id;
    TaskPhase phase = TaskPhase::kQueued;
    std::string message;
    std::chrono::system_clock::time_point at;
};

}  // namespace cherry::v2::model
