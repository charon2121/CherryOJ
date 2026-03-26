add_library(cherry_store
    in_memory_result_store.cc
    in_memory_submission_store.cc
)

target_include_directories(cherry_store
    PUBLIC
    ${PROJECT_SOURCE_DIR}/src
)

target_link_libraries(cherry_store
    PUBLIC
    cherry_domain
)
