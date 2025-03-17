#include <gtest/gtest.h>
#include "../src/sandbox/sandbox.h"
#include "../src/sandbox/sandbox_fs.h"
#include "../src/sandbox/sandbox_ns.h"

class SandboxTest : public ::testing::Test
{
protected:
    Sandbox *sandbox;
    std::string root_dir = "/home/ubuntu/cherry/workspace/sandbox";

    void SetUp() override
    {
        sandbox = new Sandbox(new SandboxFileSystem(root_dir), new SandboxNamespace());
    }

    void TearDown() override
    {
        delete sandbox;
    }
};
