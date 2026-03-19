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

add_executable(worker_main
    main.cc
)

target_link_libraries(worker_main
    PRIVATE
    cherry_worker
)
