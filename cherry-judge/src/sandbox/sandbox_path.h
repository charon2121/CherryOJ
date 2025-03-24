#ifndef SANDBOX_PATH_H
#define SANDBOX_PATH_H

/**
 * overlayfs 挂载点
 */
constexpr const char* OVERLAYFS_LOWER = "/lower";
constexpr const char* OVERLAYFS_UPPER = "/upper";
constexpr const char* OVERLAYFS_WORK = "/work";
constexpr const char* OVERLAYFS_MERGED = "/merged";

/**
 * 宿主机文件系统在沙箱内的挂载点
 */
constexpr const char* LIB = "/lib";
constexpr const char* LIB64 = "/lib64";
constexpr const char* BIN = "/bin";
constexpr const char* USR = "/usr";
constexpr const char* USR_LIB = "/usr/lib";
constexpr const char* USR_LIB64 = "/usr/lib64";
constexpr const char* USR_BIN = "/usr/bin";
constexpr const char* USR_INCLUDE = "/usr/include"; 

/**
 * 沙箱工作目录
 */
constexpr const char* WORK_SPACE = "/workspace";

#endif // SANDBOX_PATH_H