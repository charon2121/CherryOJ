#ifndef CHERRY_WORKER_WORKER_H_
#define CHERRY_WORKER_WORKER_H_

#include "types/Type.h"

namespace cherry {
namespace worker {

class Worker {
 public:
  explicit Worker(WorkerId worker_id);
  ~Worker();

  void Start();
  void Stop();

 private:
  WorkerId worker_id_;
};

}  // namespace worker
}  // namespace cherry

#endif
