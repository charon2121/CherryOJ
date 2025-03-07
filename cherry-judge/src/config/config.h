#ifndef CONFIG_H
#define CONFIG_H

#include <string>

struct Config {
    // 沙箱配置
    std::string OJ_HOME;  // OJ 的家目录
    std::string DATA_DIR;  // 题目数据目录
    std::string SANDBOX_DIR;  // 沙箱运行目录

    Config() {
        OJ_HOME = "/home/cherry/workspace";
        DATA_DIR = OJ_HOME + "/data";
        SANDBOX_DIR = OJ_HOME + "/sandbox";
    }
};

#endif // CONFIG_H
