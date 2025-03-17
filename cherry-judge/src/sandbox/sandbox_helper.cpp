#include <iostream>
#include <unistd.h>
#include <sys/wait.h>

#include "sandbox.h"
#include "sandbox_fs.h"

int main(int argc, char *argv[]) {

    SandboxFileSystem sandbox_fs("/home/ubuntu/cherry/workspace/sandbox");

    sandbox_fs.init_sandbox_paths();
    sandbox_fs.create_mount_paths();
    sandbox_fs.mount_host_fs();
    sandbox_fs.mount_overlayfs();

    std::cout << "sandbox_fs init success" << std::endl;

    return 0;
}