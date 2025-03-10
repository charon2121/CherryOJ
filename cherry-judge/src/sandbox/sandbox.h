#ifndef SANDBOX_H
#define SANDBOX_H

#include <string>
#include <vector>
#include <unordered_map>
#include <memory>
#include <stdexcept>
#include "../task/task.h"
#include "../config/config.h"
/**
 * Sandbox类用于在受控环境中编译并执行用户提交的代码。
 * 该类仅提供接口和必要的结构定义，具体实现可在对应的 .cpp 文件中进行。
 * 在沙箱中，需要限制 CPU、内存、执行时长等，以防止恶意或无限循环程序
 */

struct SandboxResult {
    // 程序退出码
    int exit_code = 0;
    // 程序标准输出
    std::vector<std::string> stdout_data;
    // 程序标准错误输出
    std::vector<std::string> stderr_data;
    // 是否因资源限制被终止
    bool killed_by_sandbox = false;
};

class Sandbox {
public:
    /**
     * 默认构造函数
     */
    Sandbox() = default;

    /**
     * 沙箱初始化，准备运行时环境
     */
    void initSandbox();

    /**
     * 设置沙箱的资源限制
     * @param time_limit_ms 最大运行时间（毫秒）
     * @param memory_limit_kb 最大内存使用量（KB）
     */
    void setResourceLimits(int time_limit_ms, int memory_limit_kb);

    /**
     * 编译代码。若语言无需编译可直接跳过。
     * @param task 提交的Task对象，包含语言、代码等信息
     * @return 编译是否成功
     */
    bool compile(const Task& task);

    /**
     * 在沙箱中运行已编译或无需编译的用户代码。
     * @param task 用户提交的Task对象
     * @return 返回运行结果，包括退出状态、输出等
     */
    SandboxResult run(const Task& task);

private:
    int max_time_limit_ms = 1000;
    int max_memory_limit_kb = 65536;
    /**
     * 内部辅助函数：实际执行编译
     * @param task 用户提交的Task对象
     * @return bool 是否编译成功
     */
    bool doCompile(const Task& task);

    /**
     * 内部辅助函数：实际执行运行
     * @param task 用户提交的Task对象
     * @return SandboxResult 运行结果
     */
    SandboxResult doRun(const Task& task);
};


#endif // SANDBOX_H
