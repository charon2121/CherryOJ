#include <gtest/gtest.h>
#include <filesystem>
#include "../src/sandbox/sandbox_fs.h"

class SandboxFsTest : public ::testing::Test {
protected:
    SandboxFileSystem *sandbox_fs;
    std::string root_dir = "/home/ubuntu/cherry/workspace/sandbox";

    void SetUp() override {
        sandbox_fs = new SandboxFileSystem(root_dir);
    }

    void TearDown() override {
        delete sandbox_fs;
    }
};

TEST_F(SandboxFsTest, SandboxFsInit) {
    // 检查挂载点是否存在
    sandbox_fs->init_sandbox_paths();
    sandbox_fs->create_mount_paths();
}
