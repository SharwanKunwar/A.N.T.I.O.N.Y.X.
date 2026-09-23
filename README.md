# A.N.T.I.O.N.Y.X.

A.N.T.I.O.N.Y.X. is a Spring Boot REST service that accepts a chat request and returns a response from an OpenAI-compatible AI provider (configured here for OpenRouter). The project is under active development; use the sections marked **For future work** to keep planned and newly added documentation in one place.

## Contents

- [Project overview](#project-overview)
- [Requirements](#requirements)
- [Configuration](#configuration)
- [Run the application](#run-the-application)
- [API](#api)
- [Request flow](#request-flow)
- [Project layout](#project-layout)
- [Tests and build](#tests-and-build)
- [Troubleshooting](#troubleshooting)
- [For future work](#for-future-work)

## Project overview

The current application exposes a chat endpoint. Spring MVC receives a JSON request, the service sends a prompt through Spring AI's `ChatClient`, and the response is returned as JSON. PostgreSQL and Spring Data JPA are included in the dependencies and database settings, though the current chat flow does not read or write database entities.

## Requirements

- JDK 21
- PostgreSQL instance (the configured Spring datasource expects one)
- An API key and compatible API base URL for the AI provider

Maven Wrapper scripts are included, so a separate Maven installation is not required.

## Configuration

At startup, `Application.java` loads a `.env` file from the project root when present and transfers these values to Java system properties:

| Variable | Purpose |
| --- | --- |
| `DB_URL` | JDBC URL for PostgreSQL, such as `jdbc:postgresql://localhost:5432/antionyx` |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `OPENROUTER_API_KEY` | Provider API key used by Spring AI |
| `AI_URL` | OpenAI-compatible API base URL for the selected provider |

Create `.env` in the project root (it is ignored by Git) and provide all five values:

```dotenv
DB_URL=jdbc:postgresql://localhost:5432/antionyx
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
OPENROUTER_API_KEY=your_api_key
AI_URL=https://openrouter.ai/api
```

Use the base URL format required by your provider and Spring AI version. Do not commit real credentials. The configured model is `moonshotai/kimi-k2`, with a maximum of 1000 output tokens; these settings are in `src/main/resources/application.properties`.

## Run the application

1. Install/configure JDK 21 and start PostgreSQL.
2. Create the database named in `DB_URL`.
3. Add the required values to the root `.env` file.
4. From the project root, start the app:

   **macOS/Linux**

   ```bash
   ./mvnw spring-boot:run
   ```

   **Windows**

   ```bat
   mvnw.cmd spring-boot:run
   ```

The service uses Spring Boot's default port, 8080, unless configured otherwise. Startup output should indicate that the application is ready.

## API

### `POST /api/assistant/chat`

Content type: `application/json`

Request shape:

```json
{
  "message": "Give me a short greeting"
}
```

Successful response shape:

```json
{
  "message": "Hello!"
}
```

Example call:

```bash
curl -X POST http://localhost:8080/api/assistant/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"Give me a short greeting"}'
```

The controller currently returns HTTP 200 when the service completes. Request validation and explicit error response handling have not yet been added.

## Request flow

1. `AssistantController` maps `POST /api/assistant/chat` and accepts `AssistantRequestDTO`.
2. `AssistantService` uses Spring AI `ChatClient` to call the configured model.
3. `AssistantMapper` turns the model output into `AssistantResponseDTO`.
4. The controller returns the response DTO as JSON.

`AiConfig` creates the `ChatClient` bean from Spring AI's builder. The service and mapper interfaces/classes are in the `assistant` package tree.

## Project layout

```text
src/main/java/com/unpredictableXassistant/A/N/T/I/O/N/Y/X/
├── Application.java                         # Startup and .env loading
└── assistant/
    ├── config/AiConfig.java                 # ChatClient bean
    ├── controller/AssistantController.java  # HTTP route
    ├── dtos/                                # Request and response payloads
    ├── mapper/AssistantMapper.java          # Output-to-response mapping
    └── service/                             # Chat service contract and implementation
src/main/resources/application.properties   # Spring/database/AI settings
src/test/java/.../ApplicationTests.java      # Spring context smoke test
pom.xml                                      # Dependencies and build settings
```

## Tests and build

Run the test suite:

```bash
./mvnw test
```

Build the project:

```bash
./mvnw clean package
```

The current test is a Spring application context smoke test. It needs working configuration for the services Spring initializes, including the datasource and AI integration where applicable.

## Troubleshooting

- **Missing configuration at startup:** confirm all five variables are present in the root `.env`. `ignoreIfMissing()` allows the file itself to be absent, but the app still expects configuration values.
- **Database connection failure:** verify PostgreSQL is running, the database exists, and `DB_URL`, username, and password match it.
- **AI authentication or connection failure:** check `OPENROUTER_API_KEY`, `AI_URL`, provider availability, and model access.
- **Unexpected model output:** confirm the request JSON uses a `message` string and check the configured model and token limit.
- **Port already in use:** stop the process using port 8080 or set `server.port` in `application.properties`.

## For future work

Add documentation here as project capabilities grow. Suggested areas:

- [ ] Authentication and authorization
- [ ] Database schema, entities, and migrations
- [ ] Conversation history and persistence
- [ ] Request validation and error response format
- [ ] API examples or OpenAPI/Swagger documentation
- [ ] Deployment instructions and environment-specific configuration
- [ ] Architecture decisions and contribution guidelines

### Change notes

| Date | Change | Notes |
| --- | --- | --- |
| YYYY-MM-DD | _Add a change_ | _Add details_ |
