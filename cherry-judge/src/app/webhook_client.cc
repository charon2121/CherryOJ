#include "app/webhook_client.h"

#include <httplib/httplib.h>

#include <nlohmann/json.hpp>
#include <stdexcept>
#include <string>
#include <string_view>
#include <utility>

namespace cherry::app {
namespace {

struct ParsedUrl {
    std::string host;
    int port = 80;
    std::string path = "/";
};

ParsedUrl ParseHttpUrl(const std::string& url) {
    constexpr std::string_view prefix = "http://";
    if (url.rfind(prefix, 0) != 0) {
        throw std::invalid_argument("only http webhook url is supported");
    }

    std::string rest = url.substr(prefix.size());
    std::string host_port = rest;
    std::string path = "/";
    const auto slash = rest.find('/');
    if (slash != std::string::npos) {
        host_port = rest.substr(0, slash);
        path = rest.substr(slash);
    }

    ParsedUrl parsed;
    parsed.path = path;

    const auto colon = host_port.rfind(':');
    if (colon == std::string::npos) {
        parsed.host = host_port;
        return parsed;
    }

    parsed.host = host_port.substr(0, colon);
    parsed.port = std::stoi(host_port.substr(colon + 1));
    return parsed;
}

}  // namespace

WebhookClient::WebhookClient(std::string token) : token_(std::move(token)) {}

void WebhookClient::NotifyFinished(const domain::JudgeTask& task,
                                   const domain::JudgeResult& result) const {
    nlohmann::json body = {
        {"task_id", task.task_id},
        {"submission_id", task.submission_id},
        {"status", "finished"},
        {"result", result},
    };
    Post(task, body.dump());
}

void WebhookClient::NotifyFailed(const domain::JudgeTask& task,
                                 const std::string& message) const {
    nlohmann::json body = {
        {"task_id", task.task_id},
        {"submission_id", task.submission_id},
        {"status", "failed"},
        {"error", {{"code", "SYSTEM_ERROR"}, {"message", message}}},
    };
    Post(task, body.dump());
}

void WebhookClient::Post(const domain::JudgeTask& task,
                         const std::string& body) const {
    if (task.callback_url.empty()) {
        return;
    }

    ParsedUrl url = ParseHttpUrl(task.callback_url);
    httplib::Client client(url.host, url.port);
    client.set_connection_timeout(2, 0);
    client.set_read_timeout(5, 0);
    httplib::Headers headers = {
        {"Content-Type", "application/json"},
        {"X-Judge-Token", token_},
    };

    auto response = client.Post(url.path, headers, body, "application/json");
    if (!response || response->status < 200 || response->status >= 300) {
        throw std::runtime_error("judge webhook request failed");
    }
}

}  // namespace cherry::app
