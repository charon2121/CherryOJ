add_library(cherry_queue
    in_memory_task_queue.cc
)

target_include_directories(
    cherry_queue
    PUBLIC
    ${PROJECT_SOURCE_DIR}/src
)

target_link_libraries(
    cherry_queue
    PUBLIC
    cherry_domain
)
