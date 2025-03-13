#ifndef SANDBOX_H
#define SANDBOX_H

#include <string>
#include "sandbox_fs.h"

class Sandbox {
public:
    Sandbox(const std::string& root_path);
    ~Sandbox();

    // 初始化沙箱内部文件系统结构
    bool init();

private:
    // 沙箱根路径
    std::string root_path;
    // 沙箱文件系统
    SandboxFileSystem sandbox_fs;

    // 设置 namespace
    void set_namespace();

    // 挂载宿主机的文件系统
    void mount_host_fs();
};

#endif // SANDBOX_H
