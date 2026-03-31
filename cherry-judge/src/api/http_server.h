#ifndef CHERRY_API_HTTP_SERVER_H_
#define CHERRY_API_HTTP_SERVER_H_

#include <memory>
#include <string>

namespace httplib {
class Server;
}

namespace cherry {

namespace app {
class SubmissionService;
}  // namespace app

namespace store {
class SubmissionStore;
class ResultStore;
}  // namespace store

namespace api {

class HttpServer {
   public:
    HttpServer(app::SubmissionService* submission_service,
               const store::SubmissionStore* submission_store,
               const store::ResultStore* result_store);
    ~HttpServer();

    void Start(const std::string& host, int port);
    void Stop();

   private:
    void RegisterRoutes();

   private:
    app::SubmissionService* submission_service_;
    const store::SubmissionStore* submission_store_;
    const store::ResultStore* result_store_;
    std::unique_ptr<httplib::Server> server_;
};

}  // namespace api
}  // namespace cherry

#endif
