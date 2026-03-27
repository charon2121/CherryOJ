add_library(cherry_execution
    cpp_compiler.cc
    cpp_runner.cc
    python_runner.cc
)

target_include_directories(cherry_execution
    PUBLIC
    ${PROJECT_SOURCE_DIR}/src
)

target_link_libraries(cherry_execution
    PUBLIC
    cherry_infra
)
