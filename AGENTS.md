# Repository Guidelines

## Project Structure & Module Organization

CherryOJ is split into three services. `cherry/` is the Spring Boot backend; Java code is in `src/main/java/com/cherry`, MyBatis XML in `src/main/resources/mapper`, and tests in `src/test/java`. `cherry-web/` is the Next.js frontend; routes are under `src/app`, shared UI in `src/components`, API wrappers in `src/lib/api`, and state in `src/lib/state`. `cherry-judge/` is the C++17 judge service with modules under `src/api`, `src/app`, `src/domain`, `src/execution`, `src/judge`, `src/queue`, and `src/store`. Docs, SQL, and design notes live in `docs/`.

## Build, Test, and Development Commands

- `cd cherry && ./mvnw spring-boot:run`: run the backend locally.
- `cd cherry && ./mvnw test`: run Spring Boot/JUnit tests.
- `cd cherry-web && npm install`: install frontend dependencies.
- `cd cherry-web && npm run dev`: start the Next.js development server.
- `cd cherry-web && npm run build`: create a production frontend build.
- `cd cherry-web && npm run lint && npm run typecheck`: run ESLint and TypeScript.
- `cd cherry-judge && cmake -S . -B build && cmake --build build`: configure and build the judge.
- `./test.sh`: submit a sample judge request to `localhost:6060`.

## Coding Style & Naming Conventions

Use Java 17 conventions in `cherry/`: lowercase packages, `PascalCase` classes, `camelCase` methods and fields, and service implementations in `service/impl`. Keep controller, service, mapper, and DTO responsibilities separate. In `cherry-web/`, write React components in `PascalCase`, hooks as `useX`, and route-specific UI under the relevant `src/app` segment. Run `npm run format` for frontend formatting. In `cherry-judge/`, follow existing Google-style C++ naming: snake_case files, `.h` headers, `.cc` implementations.

## Testing Guidelines

Backend tests use Spring Boot dependencies and should be named `*Test.java` under `cherry/src/test/java`. Add focused tests for auth, services, and mappers when changing backend behavior. The frontend currently relies on linting, type checking, and build validation. The judge tree has no checked-in tests yet, so validate CMake builds and use `test.sh` for API smoke testing.

## Commit & Pull Request Guidelines

Recent history uses subjects such as `feat: ...`, `feat: refactor ...`, and occasional `update`. Prefer Conventional Commit prefixes (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`) with a concise summary. Pull requests should describe the changed subsystem, list verification commands, link issues or docs, and include screenshots for visible `cherry-web` changes.

## Security & Configuration Tips

Do not commit secrets, local database passwords, JWT keys, or generated build output. Keep SQL setup files in `docs/sql/`, and document new environment variables in the relevant README or docs page.
