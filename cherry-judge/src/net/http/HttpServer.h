#ifndef CHERRY_API_HTTP_SERVER_H
#define CHERRY_API_HTTP_SERVER_H

#include <memory>
#include <string>

namespace httplib {
class Server;
};  // namespace httplib

namespace cherry {

namespace service {
class SubmissionService;
};  // namespace service

namespace api {

class HttpServer {
 public:
  explicit HttpServer(service::SubmissionService& submissionService);
  ~HttpServer();

  HttpServer(const HttpServer&) = delete;
  HttpServer& operator=(const HttpServer&) = delete;

  void start(const std::string& host, int port);
  void stop();

 private:
  void registerRoutes();

 private:
  std::unique_ptr<httplib::Server> server_;
  service::SubmissionService& submissionService_;
};

}  // namespace api
}  // namespace cherry

#endif
