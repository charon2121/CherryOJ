#include "dispatcher/Dispatcher.h"

using namespace cherry::dispatcher;

int main(int argc, char* argv[]) {
  Dispatcher dispatcher;

  dispatcher.Run();

  return 0;
}
