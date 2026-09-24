# agentic-app-backend

TypeScript Express backend that serves business data (customers, orders) and external tools (live weather via WeatherAPI.com) through a layered controller → service → data architecture, plus a direct Gemini chat endpoint. It is the foundation for an MCP server: `@modelcontextprotocol/sdk` is installed, and the `/mcp` endpoint is on the roadmap.

## Run

```bash
npm install
cp .env.example .env   # set GEMINI_API_KEY, GEMINI_MODEL, WEATHER_API_KEY
npm run dev            # http://localhost:3000 (use PORT=3100 to run beside ai-chat-app-backend)
npx tsc --noEmit       # type-check
```

Node runs the `.ts` files directly, so there is no build step.

## Endpoints

`POST /api/chat` · `GET /api/customers[?limit=N]` · `GET /api/customers/:id` · `GET /api/orders[?limit=N]` · `GET /api/orders/:id` · `GET /api/weather?city=...`

## Structure

```
src/index.ts         # Express app and route mounting
src/routes/          # Route definitions
src/controllers/     # Request validation and HTTP responses
src/services/        # Business logic (OrderService → CustomerService, one-directional)
src/data/            # Mock customer and order data
```
