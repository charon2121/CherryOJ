#ifndef SANDBOX_H
#define SANDBOX_H

#include <string>
#include "sandbox_fs.h"
#include "sandbox_ns.h"

class Sandbox {
public:
    Sandbox(SandboxFileSystem *sandbox_fs,
            SandboxNamespace *sandbox_ns);
    ~Sandbox() = default;

private:
    // 沙箱文件系统
    SandboxFileSystem *sandbox_fs;

    // 沙箱命名空间
    SandboxNamespace *sandbox_ns;
};

#endif // SANDBOX_H
