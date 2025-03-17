#include <iostream>
#include "sandbox.h"
#include <unistd.h>
#include "sandbox_fs.h"

int main(int argc, char *argv[]) {

    SandboxFileSystem sandbox_fs("/home/ubuntu/cherry/workspace/sandbox");

    int pid = fork();
    if (pid == 0) {
        // 子进程
        sandbox_fs.init_sandbox_paths();
        sandbox_fs.create_mount_paths();
    } else {
        // 父进程
    }

    return 0;
}