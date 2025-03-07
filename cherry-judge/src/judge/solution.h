#ifndef SOLUTION_H
#define SOLUTION_H

#include <string>
#include <vector>
#include "language.h"

// 用户的提交

struct Solution {
    std::string solution_id;  // 提交唯一标识
    std::string source_code;  // 代码内容
    int problem_id;           // 题目ID
    Language language;        // 编程语言
    std::string custom_input; // 自定义数据
    Solution(const std::string& sol_id, const std::string& src_code, int prob_id, Language lang, const std::string& cust_input)
    : solution_id(sol_id), source_code(src_code), problem_id(prob_id), language(lang), custom_input(cust_input){}
};

#endif // SOLUTION_H
