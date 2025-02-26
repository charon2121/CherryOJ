#ifndef SOLUTION_H
#define SOLUTION_H

#include <string>
#include <vector>
#include "language.h"

// 用户的提交

struct Solution {
    std::string solution_id;  // 提交唯一标识
    std::string source_code;  // 代码内容
    Language language;        // 编程语言
    Solution(std::string id, std::string code, Language lang)
        : solution_id(id), source_code(code), language(lang) {}
};

#endif // SOLUTION_H
