#include "HttpServer.h"

#include <httplib/httplib.h>

#include <iostream>
#include <nlohmann/json.hpp>

#include "SubmissionService.h"
#include "types/Type.h"

using json = nlohmann::json;

namespace cherry {
namespace api {
HttpServer::HttpServer(service::SubmissionService& submissionService)
    : submissionService_(submissionService),
      server_(std::make_unique<httplib::Server>()) {}

HttpServer::~HttpServer() = default;

void HttpServer::start(const std::string& host, int port) {
    std::cout << "Starting HTTP server on " << host << ":" << port << std::endl;
    this->registerRoutes();
    server_->listen(host.c_str(), port);
}

void HttpServer::stop() {
    std::cout << "Stopping HTTP server" << std::endl;
    server_->stop();
}

void HttpServer::registerRoutes() {
    // health check
    server_->Get("/healthz",
                 [](const httplib::Request& req, httplib::Response& res) {
                     json body = {{"status", "ok"}};
                     res.set_content(body.dump(), "application/json");
                     res.status = 200;
                 });

    // create submission
    server_->Post("/submissions", [this](const httplib::Request& req,
                                         httplib::Response& res) {
        json body = json::parse(req.body);

        // validate request body
        if (!body.contains("submissionId") || !body.contains("problemId") ||
            !body.contains("sourceCode") || !body.contains("language") ||
            !body.contains("input") || !body.contains("expectedOutput")) {
            json error = {{"error", "invalid request body"}};
            res.set_content(error.dump(), "application/json");
            res.status = 400;
        }

        // create submission
        SubmissionId submissionId = body["submissionId"].get<SubmissionId>();
        ProblemId problemId = body["problemId"].get<ProblemId>();
        std::string sourceCode = body["sourceCode"].get<std::string>();
        std::string language = body["language"].get<std::string>();
        std::string input = body["input"].get<std::string>();
        std::string expectedOutput = body["expectedOutput"].get<std::string>();

        submissionService_.createSubmission(submissionId, problemId, sourceCode,
                                            language, input, expectedOutput);

        json response = {{"submissionId", submissionId}, {"status", "queued"}};
        res.set_content(response.dump(), "application/json");
        res.status = 200;
    });

    // get submission
    server_->Get(R"(/submissions/(\w+))", [this](const httplib::Request& req,
                                                 httplib::Response& res) {
        SubmissionId submissionId = (SubmissionId)req.matches[1].str();
        std::optional<service::Submission> submissionOpt =
            submissionService_.getSubmission(submissionId);

        if (!submissionOpt.has_value()) {
            json error = {{"error", "submission not found"}};
            res.set_content(error.dump(), "application/json");
            res.status = 400;
            return;
        }

        service::Submission submission = submissionOpt.value();
        json response = {{"submissionId", submission.submissionId}};
        res.set_content(response.dump(), "application/json");
        res.status = 200;
        return;
    });
}

}  // namespace api
}  // namespace cherry
