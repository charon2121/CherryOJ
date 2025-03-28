#include <gtest/gtest.h>

class SandboxTest : public ::testing::Test
{
protected:
    std::string root_dir = "/home/ubuntu/cherry/workspace/sandbox";

    void SetUp() override
    {
    }

    void TearDown() override
    {
    }
};
