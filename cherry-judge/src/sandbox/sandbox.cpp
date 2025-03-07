#include "sandbox.h"
void Sandbox::initSandbox(const Task& task) {
    // 创建沙箱内的目录
    std::string sandbox_dir = config.SANDBOX_DIR;
    // 测试部分
    std::string task_id = task.task_id;
}