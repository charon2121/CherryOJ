#include "api/http_server.h"

#include <httplib/httplib.h>

#include <nlohmann/json.hpp>
#include <stdexcept>

#include "app/submission_service.h"
#include "domain/submission.h"
#include "store/result_store.h"
#include "store/submission_store.h"

namespace cherry::api {

using nlohmann::json;

HttpServer::HttpServer(app::SubmissionService* submission_service,
                       const store::SubmissionStore* submission_store,
                       const store::ResultStore* result_store)
    : submission_service_(submission_service),
      submission_store_(submission_store),
      result_store_(result_store),
      server_(std::make_unique<httplib::Server>()) {
    if (submission_service_ == nullptr || submission_store_ == nullptr ||
        result_store_ == nullptr) {
        throw std::invalid_argument("HttpServer dependencies cannot be null");
    }
}

HttpServer::~HttpServer() = default;

void HttpServer::Start(const std::string& host, int port) {
    RegisterRoutes();
    server_->listen(host.c_str(), port);
}

void HttpServer::Stop() { server_->stop(); }

void HttpServer::RegisterRoutes() {
    server_->Get(
        "/healthz", [](const httplib::Request&, httplib::Response& res) {
            res.set_content(json{{"status", "ok"}}.dump(), "application/json");
            res.status = 200;
        });

    server_->Post("/submissions", [this](const httplib::Request& req,
                                         httplib::Response& res) {
        try {
            auto body = json::parse(req.body);
            auto submission = body.get<domain::Submission>();
            auto task_id = submission_service_->Submit(submission);

            json resp = {
                {"submission_id", submission.submission_id},
                {"task_id", task_id},
                {"status", "queued"},
            };
            res.set_content(resp.dump(), "application/json");
            res.status = 200;
        } catch (const std::exception& ex) {
            json error = {
                {"error", "invalid_request"},
                {"message", ex.what()},
            };
            res.set_content(error.dump(), "application/json");
            res.status = 400;
        }
    });

    server_->Get(R"(/submissions/([A-Za-z0-9_\-]+))",
                 [this](const httplib::Request& req, httplib::Response& res) {
                     const std::string submission_id = req.matches[1].str();

                     auto submission = submission_store_->Get(submission_id);
                     if (!submission.has_value()) {
                         json error = {
                             {"error", "not_found"},
                             {"message", "submission not found"},
                         };
                         res.set_content(error.dump(), "application/json");
                         res.status = 404;
                         return;
                     }

                     auto result = result_store_->Get(submission_id);
                     if (!result.has_value()) {
                         json resp = {
                             {"submission_id", submission_id},
                             {"status", "queued"},
                         };
                         res.set_content(resp.dump(), "application/json");
                         res.status = 200;
                         return;
                     }

                     json resp = {
                         {"submission_id", submission_id},
                         {"status", "finished"},
                         {"result", *result},
                     };
                     res.set_content(resp.dump(), "application/json");
                     res.status = 200;
                 });
}

}  // namespace cherry::api
