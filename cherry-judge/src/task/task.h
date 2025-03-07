#ifndef TASK_H
#define TASK_H

#include <string>
#include <vector>
#include "../judge/solution.h"
#include "input_source_type.h"

struct Task {
    std::string task_id;                    // 任务唯一标识（UUID）
    Solution solution;                      // 需要判题的 Solution
    InputSourceType input_source_type;      // 沙箱获取数据数据的方式
    std::vector<std::string> input_data;    // 当 input_source_type 为 INLINE 时，沙箱获取的数据内容
    std::vector<std::string> sample_output; // 当 input_source_type 为 INLINE 时，沙箱获取的数据对应的样例输出
};

#endif // TASK_H
