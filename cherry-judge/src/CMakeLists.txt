# 定义 dispatcher 模块
add_library(dispatcher
    dispatcher/Dispatcher.cc
    dispatcher/WorkerLauncher.cc
)

add_library(worker
    worker/Worker.cc
)

target_include_directories(dispatcher PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_include_directories(worker PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

add_executable(cherry 
    dispatcher/main.cc
)

add_executable(worker_process
    worker/main.cc
)

target_link_libraries(cherry
    PRIVATE
        dispatcher
)
