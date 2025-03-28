#include <iostream>
#include <unistd.h>
#include <sys/wait.h>
#include "sandbox_manager.h"

int main(int argc, char *argv[]) {
    std::cout << "开始测试沙箱初始化" << std::endl;
    SandboxManager sandbox_manager("/home/ubuntu/cherry/workspace/sandbox");
    sandbox_manager.mount_sandbox_paths();
    std::cout << "沙箱初始化完成" << std::endl;
    return 0;
}