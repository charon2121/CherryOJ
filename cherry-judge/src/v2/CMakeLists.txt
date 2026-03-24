add_library(cherry_v2_core
    queue/in_memory_task_queue.cc
    scheduler/scheduler.cc
    worker/worker_daemon.cc
    compiler/compile_executor.cc
    runner/run_executor.cc
    judge/judge_engine.cc
    api/judge_service.cc
)

target_include_directories(cherry_v2_core
    PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}
)

add_executable(cherry_v2_phase1_demo
    cmd/phase1_demo_main.cc
)

target_link_libraries(cherry_v2_phase1_demo
    PRIVATE
        cherry_v2_core
)
