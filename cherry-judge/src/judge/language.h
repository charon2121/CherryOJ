#ifndef LANGUAGE_H
#define LANGUAGE_H

#include <string>
#include <unordered_map>
#include <vector>

enum class Language {
    C = 0,  // 编译型语言（COMPILED）
    CPP = 1,
    RUST = 2,
    GOLANG = 3,
    FORTRAN = 4,
    JAVA = 5,
    CSHARP = 6,
    SWIFT = 7,
    KOTLIN = 8,
    OBJECTIVE_C = 9,
    CANGJIE = 10,   // 新语言，华为仓颉
    PYTHON_2 = 11,  // 解释型语言（INTERPRETED）
    PYTHON_3 = 12,
    RUBY = 13,
    JAVASCRIPT = 14,
    TYPESCRIPT = 15,
    LUA = 16,
    PHP = 17,
    DART = 18,
    MATLAB = 19,
    R = 20,
    JULIA = 21,
    SCALA = 22,
    SQL = 23,      // SQL 查询语言
    MONGODB = 24,  // NoSQL 查询语言
    SHELL = 25,    // 脚本语言（也算 INTERPRETED）
    PERL = 26,
    SCHEME = 27,
    COBOL = 28,
    PASCAL = 29,
    BASIC = 30
};

// 扩展的语言类型
enum class LanguageType {
    COMPILED,    // 需要编译（C, C++, Java, Rust, Scala）
    INTERPRETED, // 解释执行（Python, JavaScript, R, MATLAB）
    SQL,         // 结构化查询语言（MySQL, PostgreSQL, SQLite）
    NOSQL        // NoSQL 查询语言（MongoDB）
};

// 语言版本信息
struct LanguageVersion {
    std::string version;        // 语言版本 (如 g++ 11, Python 3.9, JDK 17)
    std::string compile_cmd;    // 编译命令
    std::string run_cmd;        // 运行命令
};

// 语言信息结构体
struct LanguageInfo {
    Language language;            // 语言
    std::string name;             // 语言名称 (C++, Java, Python)
    LanguageType type;            // 编译语言 or 解释语言
    std::string file_extension;   // 代码文件扩展名 (.cpp, .py, .java)
    bool supports_multiple_files; // 是否支持多文件编译
    bool requires_runtime;        // 是否需要运行时环境 (Java, Python 需要)
    std::vector<LanguageVersion> versions; // 支持的所有版本
};

// **语言管理类**
class LanguageManager {
    public:
        // 获取某种语言的信息
        static const LanguageInfo* get_language_info(Language lang);
    
        // 获取某种语言的所有版本
        static const std::vector<LanguageVersion>* get_language_versions(Language lang);
    
        // 通过扩展名获取语言
        static Language get_language_from_extension(const std::string& extension);
    
        // 获取所有支持的语言
        static std::vector<Language> get_supported_languages();
    private:
        // 语言映射表
        static const std::unordered_map<Language, LanguageInfo> languages;
        // 扩展名到语言的映射
        static const std::unordered_map<std::string, Language> ext_to_language;
};
#endif // LANGUAGE_H
