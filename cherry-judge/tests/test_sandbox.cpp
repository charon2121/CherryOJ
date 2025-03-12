#include <gtest/gtest.h>
#include <fstream>
#include <sys/stat.h>
#include <dirent.h>
#include <fcntl.h>
#include "../src/sandbox/sandbox.h"

class SandboxTest : public ::testing::Test
{
protected:
    Sandbox *sandbox;
    std::string root_dir = "/home/ubuntu/cherry/workspace/sandbox";

    void SetUp() override
    {
        sandbox = new Sandbox(root_dir);
        ASSERT_TRUE(sandbox->init());
    }

    void TearDown() override
    {
        delete sandbox;
    }
};

// 🧪 测试沙箱内目录的创建是否成功
TEST_F(SandboxTest, SandboxDirectoryExists)
{
    struct stat info;
    ASSERT_EQ(stat(root_dir.c_str(), &info), 0) << "Sandbox 目录未创建";
    ASSERT_TRUE(S_ISDIR(info.st_mode)) << "sandbox 不是目录";

    // 检查挂载点是否存在
    struct stat lower_dir_info;
    ASSERT_EQ(stat((root_dir + "/lower").c_str(), &lower_dir_info), 0) << "lower 挂载点未创建";
    ASSERT_TRUE(S_ISDIR(lower_dir_info.st_mode)) << "lower 挂载点不是目录";

    struct stat upper_dir_info;
    ASSERT_EQ(stat((root_dir + "/upper").c_str(), &upper_dir_info), 0) << "upper 挂载点未创建";
    ASSERT_TRUE(S_ISDIR(upper_dir_info.st_mode)) << "upper 挂载点不是目录";

    struct stat work_dir_info;
    ASSERT_EQ(stat((root_dir + "/work").c_str(), &work_dir_info), 0) << "work 挂载点未创建";
    ASSERT_TRUE(S_ISDIR(work_dir_info.st_mode)) << "work 挂载点不是目录";

    struct stat merged_dir_info;
    ASSERT_EQ(stat((root_dir + "/merged").c_str(), &merged_dir_info), 0) << "merged 挂载点未创建";
    ASSERT_TRUE(S_ISDIR(merged_dir_info.st_mode)) << "merged 挂载点不是目录";

    // 检查宿主机文件系统在沙箱内的挂载点是否存在
    struct stat lib_dir_info;
    ASSERT_EQ(stat((root_dir + "/lower/lib").c_str(), &lib_dir_info), 0) << "lib 挂载点未创建";
    ASSERT_TRUE(S_ISDIR(lib_dir_info.st_mode)) << "lib 挂载点不是目录";

    struct stat usr_dir_info;
    ASSERT_EQ(stat((root_dir + "/lower/usr").c_str(), &usr_dir_info), 0) << "usr 挂载点未创建";
    ASSERT_TRUE(S_ISDIR(usr_dir_info.st_mode)) << "usr 挂载点不是目录";

    struct stat usr_lib_dir_info;
    ASSERT_EQ(stat((root_dir + "/lower/usr/lib").c_str(), &usr_lib_dir_info), 0) << "usr_lib 挂载点未创建";
    ASSERT_TRUE(S_ISDIR(usr_lib_dir_info.st_mode)) << "usr_lib 挂载点不是目录";

    struct stat usr_lib64_dir_info;
    ASSERT_EQ(stat((root_dir + "/lower/usr/lib64").c_str(), &usr_lib64_dir_info), 0) << "usr_lib64 挂载点未创建";
    ASSERT_TRUE(S_ISDIR(usr_lib64_dir_info.st_mode)) << "usr_lib64 挂载点不是目录";

    struct stat usr_bin_dir_info;
    ASSERT_EQ(stat((root_dir + "/lower/usr/bin").c_str(), &usr_bin_dir_info), 0) << "usr_bin 挂载点未创建";
    ASSERT_TRUE(S_ISDIR(usr_bin_dir_info.st_mode)) << "usr_bin 挂载点不是目录";

    struct stat usr_include_dir_info;
    ASSERT_EQ(stat((root_dir + "/lower/usr/include").c_str(), &usr_include_dir_info), 0) << "usr_include 挂载点未创建";
    ASSERT_TRUE(S_ISDIR(usr_include_dir_info.st_mode)) << "usr_include 挂载点不是目录";
}

// 检查宿主机文件系统在沙箱内的挂载是否成功
TEST_F(SandboxTest, SandboxMount)
{
    // check paths
    std::vector<std::string> paths = {
        "/lower/lib",
        "/lower/usr/lib",
        "/lower/usr/lib64",
        "/lower/usr/bin",
        "/lower/usr/include",
    };

    for (const auto &path : paths)
    {
        struct stat lib_dir_info;
        ASSERT_EQ(stat((root_dir + path).c_str(), &lib_dir_info), 0) << path + " 挂载点未创建";

        // 检查挂载点内是否存在宿主机中的文件
        DIR *dir = opendir((root_dir + path).c_str());
        ASSERT_NE(dir, nullptr) << path + " 挂载点未创建";
        struct dirent *entry;

        int file_count = 0;
        while ((entry = readdir(dir)) != nullptr)
        {
            // 忽略 . 和 ..
            if (strcmp(entry->d_name, ".") == 0 || strcmp(entry->d_name, "..") == 0)
            {
                continue;
            }
            file_count++;
        }
        ASSERT_GT(file_count, 0) << path + " 挂载点内不存在文件";
        closedir(dir);
    }
}

/**
 * 测试向沙箱内挂载的文件系统中写入文件
 * 如果写入成功，表示只读挂载失败
 */
TEST_F(SandboxTest, SandboxWriteFile)
{
    // check paths
    std::vector<std::string> paths = {
        "/lower/lib",
        "/lower/usr/lib",
        "/lower/usr/lib64",
        "/lower/usr/bin",
        "/lower/usr/include",
    };

    for (const auto &path : paths) {
        // 检查文件是否存在
        // -1 表示文件创建失败，只读挂载成功
        int fd = creat((root_dir + path + "/test.txt").c_str(), 0644);
        ASSERT_EQ(fd, -1) << path + "创建 test.txt 成功，只读挂载失败";
        close(fd);
    }
}

TEST_F(SandboxTest, SandboxOverlayfs)
{
    // 
}
