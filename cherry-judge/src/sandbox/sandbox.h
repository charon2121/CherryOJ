#ifndef SANDBOX_H
#define SANDBOX_H

#include <string>

class Sandbox {
public:
    Sandbox(const std::string& root_dir);
    ~Sandbox();

    // 初始化代码沙箱
    bool init();

    // 启动代码沙箱
    void start();

private:
    std::string root_dir;
    std::string ipc_socket_path;

    // 
    bool setup_mount_namespace();
    bool setup_overlayfs();
    bool setup_ipc();
};

#endif // SANDBOX_H
