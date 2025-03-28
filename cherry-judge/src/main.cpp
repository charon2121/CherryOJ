#include <iostream>
#include "judge/result.h"
#include "judge/solution.h"
#include <sys/wait.h>
#include <unistd.h>

int main(int argc, char** argv) {
    std::cout << "开始测试沙箱初始化" << std::endl;

    pid_t pid = fork();

    if (pid == 0) {
        execl("./sandbox", "./sandbox", NULL);
        perror("execl failed");
        exit(1);
    } else if (pid > 0) {
        waitpid(pid, NULL, 0);
    } else {
        perror("fork failed");
    }
    return 0;
}
