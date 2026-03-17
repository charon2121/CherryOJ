#include "WorkerManager.h"

int main(int argc, char* argv[]) 
{ 
  cherry::worker::WorkerManager worker_manager(2);
  worker_manager.Start();
  
  return 0; 
}
