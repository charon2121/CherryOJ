#ifndef JUDGE_RESULT_H
#define JUDGE_RESULT_H

#include <string>
#include <unordered_map>

// 评测状态枚举
enum class JudgeStatus {
    WAITING_0 = 0,            // WT0 - 初始等待状态
    WAITING_1 = 1,            // WT1 - 进入评测队列
    COMPILING = 2,            // CI - 代码编译中
    RUNNING = 3,              // RI - 代码运行中
    ACCEPTED = 4,             // AC - 通过
    PRESENTATION_ERROR = 5,   // PE - 输出格式错误
    WRONG_ANSWER = 6,         // WA - 输出错误
    TIME_LIMIT_EXCEEDED = 7,  // TL - 超时
    MEMORY_LIMIT_EXCEEDED = 8,// ML - 内存超限
    OUTPUT_LIMIT_EXCEEDED = 9,// OL - 输出超限
    RUNTIME_ERROR = 10,       // RE - 运行时错误
    COMPILATION_ERROR = 11,   // CE - 编译错误
    CONTACT_ADMIN = 12,       // CO - 需要联系管理员
    TESTING_REJUDGE = 13      // TR - 重新评测
};

// 评测结果结构体
struct JudgeResult {
    std::string task_id;     // 任务 ID
    JudgeStatus status;      // 评测状态
    int time_used;           // 运行时间（毫秒）
    int memory_used;         // 运行内存（KB）
    int exit_code;           // 进程退出码
    int signal;              // 终止信号（如 SIGSEGV）
    std::string error_message; // 错误信息
    int testcases_passed;    // 通过的测试用例数
    int total_testcases;     // 总测试用例数

    // 状态枚举 <-> 字符串映射
    static std::string status_to_string(JudgeStatus status);
    static JudgeStatus string_to_status(const std::string& str);
};

#endif // JUDGE_RESULT_H
