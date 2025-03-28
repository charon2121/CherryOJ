#include <gtest/gtest.h>
#include "../src/sandbox/sandbox_manager.h"

class SandboxFsTest : public ::testing::Test {
protected:
    SandboxManager *sandbox_manager;
    std::string root_dir = "/home/ubuntu/cherry/workspace/sandbox";

    void SetUp() override {
    }

    void TearDown() override {
    }
};

TEST_F(SandboxFsTest, SandboxFsInit) {
}
