#ifndef CHERRY_DOMAIN_LANGUAGE_H_
#define CHERRY_DOMAIN_LANGUAGE_H_

#include <nlohmann/json.hpp>
#include <stdexcept>
#include <string>

namespace cherry::domain {

enum class Language {
    kCpp,
    kPython,
};

inline std::string LanguageToString(Language language) {
    switch (language) {
        case Language::kCpp:
            return "cpp";
        case Language::kPython:
            return "python";
    }
    throw std::invalid_argument("invalid Language enum value");
}

inline Language LanguageFromString(const std::string& value) {
    if (value == "cpp") {
        return Language::kCpp;
    }
    if (value == "python") {
        return Language::kPython;
    }
    throw std::invalid_argument("unsupported language: " + value);
}

inline void to_json(nlohmann::json& json, const Language& language) {
    json = LanguageToString(language);
}

inline void from_json(const nlohmann::json& json, Language& language) {
    language = LanguageFromString(json.get<std::string>());
}

}  // namespace cherry::domain

#endif
