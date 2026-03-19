cmake_minimum_required(VERSION 3.16)
project(cherry-judge C CXX)

# 设置 C++ 标准
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# 引入第三方依赖
# 处理 json 和 http 类似的 http only 库
add_library(thrid_party INTERFACE)
target_include_directories(thrid_party
    INTERFACE
    ${PROJECT_SOURCE_DIR}/thrid_party
)

add_subdirectory(src)
