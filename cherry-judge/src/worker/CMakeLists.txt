add_library(cherry_worker
    Worker.cc
    WorkerManager.cc
)

target_include_directories(cherry_worker
    PUBLIC
    ${PROJECT_SOURCE_DIR}/src
)

target_link_libraries(cherry_worker
    PUBLIC
    cherry_common
)
