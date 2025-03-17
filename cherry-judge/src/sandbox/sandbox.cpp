#include <sys/mount.h>
#include "sandbox.h"
#include "sandbox_path.h"

// 构造函数，初始化沙箱文件系统
Sandbox::Sandbox(SandboxFileSystem *sandbox_fs,
                 SandboxNamespace *sandbox_ns)
    : sandbox_fs(sandbox_fs),
      sandbox_ns(sandbox_ns) {}