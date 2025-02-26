#ifndef TASK_H
#define TASK_H

#include <string>
#include <vector>
#include "../judge/solution.h"

struct Task {
    std::string task_id;                  // 任务唯一标识（UUID）
    Solution solution;                    // 需要判题的 Solution
    std::vector<std::string> test_cases;  // 标准输入测试用例
    std::vector<std::string> expected_outputs; // 标准输出
    int time_limit;                       // 时间限制（ms）
    int memory_limit;                     // 内存限制（MB）
    int stack_limit;                      // 栈限制
    int max_score;                        // 题目满分（默认 100）

    Task(std::string id, Solution sol, std::vector<std::string> cases, std::vector<std::string> outputs,
         int time_limit_ms, int memory_limit_mb, int score = 100)
        : task_id(id), solution(sol), test_cases(cases), expected_outputs(outputs),
          time_limit(time_limit_ms), memory_limit(memory_limit_mb), max_score(score) {}
};

#endif // TASK_H
