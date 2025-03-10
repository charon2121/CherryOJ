#include <iostream>
#include "judge/result.h"
#include "judge/solution.h"
#include "sandbox/sandbox.h"
#include <sys/wait.h>
#include <unistd.h>

int main(int argc, char** argv) {

    std::cout << "开始测试沙箱初始化" << std::endl;
    Sandbox sandbox;

    pid_t pid = fork();

    if (pid == 0) {
        // 子进程
        sandbox.initSandbox();
        std::cout << "沙箱初始化完成" << std::endl;
        return 0;
    } else if (pid > 0) {
        // 父进程
        wait(NULL);
    } else {
        perror("fork failed");
        return 1;
    }

    std::cout << "沙箱初始化测试完成" << std::endl;
    return 0;
}
