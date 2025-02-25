#include "language.h"

const std::unordered_map<Language, LanguageInfo> LanguageManager::languages = {
    {Language::C, {Language::C, "C", LanguageType::COMPILED, ".c", true, false,
        {{"GCC 10", "gcc {source} -o {output}", "{output}"}}}},

    {Language::CPP, {Language::CPP, "C++", LanguageType::COMPILED, ".cpp", true, false,
        {{"G++ 11", "g++ {source} -o {output}", "{output}"}}}},

    {Language::JAVA, {Language::JAVA, "Java", LanguageType::COMPILED, ".java", true, true,
        {{"JDK 17", "javac {source}", "java {output}"}}}},

    {Language::PYTHON_3, {Language::PYTHON_3, "Python 3", LanguageType::INTERPRETED, ".py", false, true,
        {{"Python 3.9", "", "python3 {source}"}}}},
};

// 获取语言信息
const LanguageInfo* LanguageManager::get_language_info(Language lang) {
    auto it = languages.find(lang);
    return (it != languages.end()) ? &(it->second) : nullptr;
}

// 获取所有支持的语言
std::vector<Language> LanguageManager::get_supported_languages() {
    std::vector<Language> supported;
    for (const auto& pair : languages) {
        supported.push_back(pair.first);
    }
    return supported;
}