#include "sandbox.h"
#include <iostream>
#include <fstream>
#include <cstdlib>
#include <sys/resource.h>
#include <sys/wait.h>
#include <unistd.h>
#include <sys/mount.h>
#include "../config/config.h"
#include <sys/stat.h>

// 构造函数
Sandbox::Sandbox(const std::string& root_dir) : root_dir(root_dir) {
}

// 析构函数
Sandbox::~Sandbox() {   
    // 卸载挂载点
}

// 初始化代码沙箱
bool Sandbox::init() {
    // 创建新的挂载命令空间
    if (unshare(CLONE_NEWNS) != 0) {
        perror("unshare(CLONE_NEWNS) failed");
        return false;
    }

    // 表示将挂载点设置为private模式，后续挂载或卸载操作不再对外传播。
    if (mount("none", "/", NULL, MS_REC | MS_PRIVATE, NULL) != 0) {
        perror("mount MS_REC|MS_PRIVATE failed");
        return false;
    }
    
    // 创建文件系统结构
    mkdir(Config::SANDBOX_DIR.c_str(), 0755);
    mkdir(Config::LOWER_DIR.c_str(), 0755);
    mkdir(Config::UPPER_DIR.c_str(), 0755);
    mkdir(Config::WORK_DIR.c_str(), 0755);
    mkdir(Config::MERGED_DIR.c_str(), 0755);
    mkdir(Config::LIB_DIR.c_str(), 0755);
    mkdir(Config::USR_DIR.c_str(), 0755);
    mkdir(Config::USR_LIB_DIR.c_str(), 0755);
    mkdir(Config::USR_LIB64_DIR.c_str(), 0755);
    mkdir(Config::USR_INCLUDE_DIR.c_str(), 0755);

    // 将宿主机的 /lib 和 /usr 挂载到沙箱的 /lower 目录下
    if (mount("/lib", Config::LIB_DIR.c_str(), NULL, MS_BIND | MS_REC, NULL) != 0) {
        perror("mount /lib failed");
        return false;
    }
    if (mount("/usr/lib", Config::USR_LIB_DIR.c_str(), NULL, MS_BIND | MS_REC, NULL) != 0) {
        perror("mount /usr/lib failed");
        return false;
    }
    if (mount("/usr/lib64", Config::USR_LIB64_DIR.c_str(), NULL, MS_BIND | MS_REC, NULL) != 0) {
        perror("mount /usr/lib64 failed");
        return false;
    }
    if (mount("/usr/include", Config::USR_INCLUDE_DIR.c_str(), NULL, MS_BIND | MS_REC, NULL) != 0) {
        perror("mount /usr/include failed");
        return false;
    }

    // 重新挂载
    if (mount("/lib", Config::LIB_DIR.c_str(), NULL, MS_BIND | MS_REC | MS_RDONLY, NULL) != 0) {
        perror("mount /lib failed");
        return false;
    }
    if (mount("/usr/lib", Config::USR_LIB_DIR.c_str(), NULL, MS_BIND | MS_REC | MS_RDONLY, NULL) != 0) {
        perror("mount /usr/lib failed");
        return false;
    }   
    if (mount("/usr/lib64", Config::USR_LIB64_DIR.c_str(), NULL, MS_BIND | MS_REC | MS_RDONLY, NULL) != 0) {
        perror("mount /usr/lib64 failed");
        return false;
    }
    if (mount("/usr/include", Config::USR_INCLUDE_DIR.c_str(), NULL, MS_BIND | MS_REC | MS_RDONLY, NULL) != 0) {
        perror("mount /usr/include failed");
        return false;
    }
    
    return true;
}
