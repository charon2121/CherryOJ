#ifndef INPUT_SOURCE_TYPE_H
#define INPUT_SOURCE_TYPE_H

enum class InputSourceType {
    INLINE,     // 沙箱通过字符串形式获取输入数据（内存中存储，适用于小数据）
    PROBLEM_IO  // 沙箱通过 `problem_id` 在文件系统中查询测试数据
};

#endif // INPUT_SOURCE_TYPE_H
