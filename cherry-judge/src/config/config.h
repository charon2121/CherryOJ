#ifndef CONFIG_H
#define CONFIG_H

#include <string>

namespace Config {
    /**
     * 沙箱内部结构
     * 
     * /sandbox
     *  /lib
     *  /usr
     *    /lib
     *    /lib64
     *    /bin
     *    /include
     */
    const std::string OJ_HOME = "/home/ubuntu/cherry/workspace";
    const std::string DATA_DIR = OJ_HOME + "/data";
    const std::string SANDBOX_DIR = OJ_HOME + "/sandbox";
    const std::string LIB_DIR = SANDBOX_DIR + "/lib";
    const std::string USR_DIR = SANDBOX_DIR + "/usr";
    const std::string USR_LIB_DIR = SANDBOX_DIR + "/usr/lib";
    const std::string USR_LIB64_DIR = SANDBOX_DIR + "/usr/lib64";
    const std::string USR_INCLUDE_DIR = SANDBOX_DIR + "/usr/include";
}

#endif // CONFIG_H
