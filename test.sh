#!/bin/bash

curl -X POST http://localhost:6060/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "submission_id": "sub_001",
    "problem_id": "two_sum",
    "language": "cpp",
    "source_code": "#include <iostream>\nusing namespace std;\nint main() {\n    long long a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}",
    "test_cases": [
      {
        "case_id": "1",
        "input": "1 2",
        "expected_output": "3",
        "score": 10
      },
      {
        "case_id": "2",
        "input": "100 200",
        "expected_output": "300",
        "score": 10
      },
      {
        "case_id": "3",
        "input": "-5 10",
        "expected_output": "5",
        "score": 10
      }
    ]
  }'