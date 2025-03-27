cmake_minimum_required(VERSION 3.10)
project(cherry-judge)

# 设置 C++ 标准
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include(FetchContent)

FetchContent_Declare(
    googletest # google test
    URL https://github.com/google/googletest/archive/refs/tags/v1.14.0.zip
)

FetchContent_Declare(
    spdlog # 日志库
    URL https://github.com/gabime/spdlog/archive/refs/tags/v1.15.1.zip
)

FetchContent_MakeAvailable(googletest)
FetchContent_MakeAvailable(spdlog)

enable_testing()

# 添加可执行文件，并包含 src/result/result.cpp
add_executable(judge src/main.cpp src/judge/result.cpp src/judge/language.cpp)
add_executable(sandbox src/sandbox/sandbox_helper.cpp)
add_executable(sandbox_helper src/sandbox/sandbox_helper.cpp)

# 指定头文件目录
target_include_directories(judge PRIVATE ${CMAKE_SOURCE_DIR}/src)
target_include_directories(sandbox PRIVATE ${CMAKE_SOURCE_DIR}/src)

# 添加测试
add_executable(test_sandbox tests/test_sandbox.cpp)
target_link_libraries(test_sandbox PRIVATE gtest_main)
add_test(NAME test_sandbox COMMAND test_sandbox)

add_executable(test_sandbox_fs tests/test_sandbox_fs.cpp)
target_link_libraries(test_sandbox_fs PRIVATE gtest_main)
add_test(NAME test_sandbox_fs COMMAND test_sandbox_fs)
