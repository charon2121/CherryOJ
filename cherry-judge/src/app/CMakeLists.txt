find_package(Threads REQUIRED)

add_library(cherry_app
    judge_pipeline.cc
    submission_service.cc
    task_service.cc
)

target_include_directories(cherry_app
    PUBLIC
    ${PROJECT_SOURCE_DIR}/src
)

target_link_libraries(cherry_app
    PUBLIC
    cherry_execution
    cherry_queue
    cherry_store
    Threads::Threads
)
