add_library(cherry_common
    event/EventLoop.cc
    event/EventQueue.cc
)

target_include_directories(cherry_common
    PUBLIC
        ${PROJECT_SOURCE_DIR}/src
)

target_link_libraries(cherry_common
    PUBLIC
        cherry_types
)
