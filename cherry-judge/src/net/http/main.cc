#include "HttpServer.h"
#include "SubmissionService.h"

int main() {

  cherry::service::SubmissionService submissionService;

  cherry::api::HttpServer server(submissionService);

  server.start("0.0.0.0", 6060);

  return 0;
}
