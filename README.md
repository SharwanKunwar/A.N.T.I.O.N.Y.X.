# A.N.T.I.O.N.Y.X.

A.N.T.I.O.N.Y.X. is a Spring Boot REST API for sending a prompt to an OpenAI-compatible chat model through Spring AI. The application uses PostgreSQL configuration for persistence-ready development, although no entity or repository has been added yet.

## Technology

- Java 21
- Spring Boot 4.1.1
- Spring MVC
- Spring AI 2.0.1
- OpenRouter-compatible chat endpoint
- PostgreSQL and Spring Data JPA
- Maven Wrapper
- Lombok

## Requirements

- JDK 21
- Internet access to the configured AI provider
- PostgreSQL, if database features are enabled later
- An OpenRouter or compatible provider API key

Check the installed Java version:

```bash
java -version
```

## Configuration

Create a `.env` file in the project root. Do not commit it because it contains secrets.

```dotenv
DB_URL=jdbc:postgresql://localhost:5432/antionyx
DB_USERNAME=postgres
DB_PASSWORD=change-me
OPENROUTER_API_KEY=your-api-key
AI_URL=https://openrouter.ai/api/v1
```

The application loads these values at startup and maps them to the properties in `src/main/resources/application.properties`:

| Variable | Purpose |
| --- | --- |
| `DB_URL` | JDBC URL for PostgreSQL |
| `DB_USERNAME` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `OPENROUTER_API_KEY` | API key used by Spring AI |
| `AI_URL` | OpenAI-compatible API base URL |

The current model is configured as `moonshotai/kimi-k2`, with a maximum of 1,000 output tokens.

## Run the application

On Linux or macOS:

```bash
./mvnw spring-boot:run
```

On Windows:

```bat
mvnw.cmd spring-boot:run
```

The default server port is `8080`.

Build and test the project with:

```bash
./mvnw clean test
```

## API

### Chat with the assistant

`POST /api/assistant/chat`

Request:

```http
Content-Type: application/json
```

```json
{
  "message": "Explain dependency injection in one sentence."
}
```

Response:

```json
{
  "message": "Dependency injection provides an object's dependencies from outside the object."
}
```

Example with `curl`:

```bash
curl -X POST http://localhost:8080/api/assistant/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"Explain dependency injection in one sentence."}'
```

## Request flow

1. `AssistantController` receives `POST /api/assistant/chat`.
2. `AssistantService` sends the request to Spring AI's `ChatClient`.
3. The configured OpenAI-compatible provider generates a response.
4. `AssistantMapper` wraps the generated text in `AssistantResponseDTO`.

The current service builds the model prompt from `AssistantRequestDTO.toString()`. This means the model receives the DTO representation rather than only the raw `message` value. See the future work section before changing this behavior.

## Project structure

```text
src/main/java/.../X/
├── Application.java                 Application entry point and .env loading
└── assistant/
    ├── config/AiConfig.java         ChatClient bean configuration
    ├── controller/                  HTTP endpoints
    ├── dtos/                        Request and response objects
    ├── mapper/                      DTO and model-output mapping
    └── service/                     Assistant service contract and implementation
```

## Development notes

- `spring.jpa.hibernate.ddl-auto=update` is enabled for development. Use migrations and a safer schema strategy before production deployment.
- SQL and bound parameter logging are enabled. Disable these logs in environments where queries may contain sensitive data.
- Request validation is included as a dependency, but the request DTO currently has no validation annotations.
- There is currently no authentication, rate limiting, conversation persistence, or global error response format.
- Keep API keys and database credentials in environment variables or a secret manager.

## Future work

- Pass `requestDTO.getMessage()` directly to the model prompt.
- Add validation for blank or oversized messages.
- Add controller and service tests for successful and failed AI calls.
- Add consistent handling for provider timeouts and quota errors.
- Add persistence entities and repositories when conversation history is needed.
- Add authentication and request rate limiting before exposing the API publicly.
- Add database migrations and production-specific configuration.

## Package naming

The Java package is `com.unpredictableXassistant.A.N.T.I.O.N.Y.X`. The dotted project name is preserved in the project identity, while the package path follows Java package naming rules.# A.N.T.I.O.N.Y.X.

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
