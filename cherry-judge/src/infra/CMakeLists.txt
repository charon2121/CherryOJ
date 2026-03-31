add_library(cherry_infra
    workspace_manager.cc
    process_executor.cc
)

target_include_directories(cherry_infra
    PUBLIC
    ${PROJECT_SOURCE_DIR}/src
)

target_link_libraries(cherry_infra
    PUBLIC
    cherry_domain
)