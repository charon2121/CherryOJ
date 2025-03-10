cmake_minimum_required(VERSION 3.10)
project(cherry-judge)

# 设置 C++ 标准
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 添加可执行文件，并包含 src/result/result.cpp
add_executable(judge src/main.cpp src/judge/result.cpp src/sandbox/sandbox.cpp src/judge/language.cpp)

# 指定头文件目录
target_include_directories(judge PRIVATE ${CMAKE_SOURCE_DIR}/src)
