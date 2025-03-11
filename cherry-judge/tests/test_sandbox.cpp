#include <gtest/gtest.h>
#include "../src/sandbox/sandbox.h"
#include <fstream>
#include <sys/stat.h>

class SandboxTest : public ::testing::Test {
protected:
    Sandbox* sandbox;
    void SetUp() override {
        sandbox = new Sandbox("/home/ubuntu/cherry/workspace/sandbox");
        ASSERT_TRUE(sandbox->init());
    }

    void TearDown() override {
        delete sandbox;
    }
};

// 🧪 测试是否成功创建 `sandbox` 目录
TEST_F(SandboxTest, SandboxDirectoryExists) {
    struct stat info;
    ASSERT_EQ(stat("/home/ubuntu/cherry/workspace/sandbox", &info), 0) << "Sandbox 目录未创建";
    ASSERT_TRUE(S_ISDIR(info.st_mode)) << "sandbox 不是目录";
}
