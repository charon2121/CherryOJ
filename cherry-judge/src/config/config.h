#ifndef CONFIG_H
#define CONFIG_H

#include <string>

namespace Config {
    /**
     * 沙箱内部结构, 使用 overlayfs 联合文件系统
     * 
     * /sandbox
     *  /lower
     *    /lib
     *    /usr
     *      /lib
     *      /lib64
     *      /bin
     *      /include
     *  /upper
     *  /work
     *  /merged
     */
    const std::string OJ_HOME = "/home/ubuntu/cherry/workspace";
    const std::string DATA_DIR = OJ_HOME + "/data";
    const std::string SANDBOX_DIR = OJ_HOME + "/sandbox";
    const std::string LOWER_DIR = SANDBOX_DIR + "/lower";
    const std::string UPPER_DIR = SANDBOX_DIR + "/upper";
    const std::string WORK_DIR = SANDBOX_DIR + "/work";
    const std::string MERGED_DIR = SANDBOX_DIR + "/merged";
    const std::string LIB_DIR = LOWER_DIR + "/lib";
    const std::string USR_DIR = LOWER_DIR + "/usr";
    const std::string USR_LIB_DIR = USR_DIR + "/lib";
    const std::string USR_LIB64_DIR = USR_DIR + "/lib64";
    const std::string USR_INCLUDE_DIR = USR_DIR + "/include";
}

#endif // CONFIG_H
