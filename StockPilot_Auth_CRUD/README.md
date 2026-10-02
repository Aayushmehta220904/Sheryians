# StockPilot

**Authentication & Product CRUD APIs - Sheryians Coding School Assignment**

StockPilot is a small e-commerce product catalog built as a single full-stack repository. It implements JWT access and refresh token authentication, server-side refresh-token revocation/rotation, complete Product CRUD APIs, `express-validator` validation, and a React frontend that consumes the API.

## Assignment coverage

### Authentication

- `POST /api/auth/register` - creates a user, hashes the password, returns the user without password or tokens.
- `POST /api/auth/login` - verifies credentials, returns a short-lived access token and sets a long-lived refresh token in an `httpOnly` cookie.
- `POST /api/auth/refresh-token` - validates the refresh JWT against the database, rotates it, and returns a new access token.
- `POST /api/auth/logout` - protected route that revokes the current refresh token and clears the cookie.
- `GET /api/auth/me` - protected route that returns the authenticated user.

### Product CRUD

- `POST /api/products` - authenticated create.
- `GET /api/products` - public product list with optional `search`, `category`, `page`, and `limit` query parameters.
- `GET /api/products/:id` - public single-product lookup.
- `PUT /api/products/:id` - authenticated update.
- `DELETE /api/products/:id` - authenticated delete.

Write operations are additionally owner-scoped: a user can only update or delete products they created.

### Validation

`express-validator` runs before controller logic for every accepted body, route parameter, and query input.

- Registration: name, email, password strength, confirm-password match.
- Login: valid email and required password.
- Products: name, description, category, non-negative price, integer stock, optional valid image URL.
- Route params: valid MongoDB ObjectId.
- Query values: validated pagination/search/category values.
- Invalid input returns field-level `400` errors in the form `{ field, message }`.

## Security decisions

- Passwords are hashed using bcrypt with 12 salt rounds.
- Password hashes are excluded from normal MongoDB queries and never returned by the API.
- Access tokens are short-lived and sent to the frontend in JSON.
- Refresh tokens are stored in an `httpOnly` cookie.
- Only SHA-256 hashes of refresh tokens are persisted in MongoDB.
- Refresh tokens rotate whenever `/refresh-token` succeeds.
- Logout removes the corresponding refresh-token hash from the database.
- Protected routes require `Authorization: Bearer <access-token>`.
- Login is rate-limited to reduce brute-force attempts.
- Helmet security headers are enabled.
- Secrets live in environment variables and are never committed.

## Project structure

```text
StockPilot_Auth_CRUD/
├── client/                 React + Vite frontend
│   └── src/
│       ├── components/
│       ├── context/
│       ├── lib/
│       └── pages/
├── server/                 Node.js + Express API
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── utils/
│       └── validators/
├── docs/API.md
├── .env.example
├── render.yaml
└── package.json
```

## Local setup

### 1. Prerequisites

- Node.js 18+
- MongoDB locally or a MongoDB Atlas connection string

### 2. Configure environment variables

Copy the root example into the server folder:

```bash
cp .env.example server/.env
```

Update at least:

```env
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=a_long_random_secret
REFRESH_TOKEN_SECRET=a_different_long_random_secret
```

For development, keep:

```env
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Install dependencies

From the repository root:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

### 4. Start both applications

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5001`  
Health check: `http://localhost:5001/api/health`

## Production build

```bash
npm run build
npm start
```

In production the Express server serves `client/dist`, so the frontend and API can share one origin. This keeps refresh-cookie handling straightforward.

## Deployment

The repository includes `render.yaml` for a single Render web service.

1. Push the repository to GitHub.
2. Create a Render Blueprint/Web Service from the repository.
3. Add `MONGODB_URI` securely in Render.
4. Render can generate the access/refresh secrets specified in `render.yaml`.
5. Build command: `npm install && npm run build`.
6. Start command: `npm start`.

For MongoDB Atlas, remember to allow the deployment environment to connect to the cluster.

## Authentication flow

```text
Register
  └─ password hashed, no tokens returned

Login
  ├─ bcrypt.compare verifies password
  ├─ short-lived access JWT returned in JSON
  └─ long-lived refresh JWT set as httpOnly cookie

Protected API request
  └─ Authorization: Bearer <access-token>

Access token expires
  └─ POST /api/auth/refresh-token
       ├─ verify refresh JWT
       ├─ hash token and compare with DB record
       ├─ revoke old refresh token
       ├─ issue rotated refresh token cookie
       └─ return brand-new access token

Logout
  ├─ delete current refresh-token hash from DB
  └─ clear refresh cookie
```

## Product ownership

Product read routes are public. Create requires authentication. Update and delete require both authentication and ownership. This is stricter than simply protecting the write routes and prevents one authenticated user from editing another user's products.

## Error response examples

Validation error:

```json
{
  "message": "Please correct the highlighted fields.",
  "errors": [
    {
      "field": "price",
      "message": "Price must be a number greater than or equal to 0."
    }
  ]
}
```

Authentication error:

```json
{
  "message": "Access token is invalid or expired."
}
```

## Frontend functionality

- Public responsive product catalog.
- Search and category filtering.
- Registration and login forms with backend field-error display.
- Session restoration through the refresh-token endpoint.
- Protected management dashboard.
- Product statistics.
- Create product modal.
- Edit product modal.
- Delete confirmation flow.
- Logout and protected-route redirection.
- Empty, loading, error, and success states.

## Author

Built by **Aayush Mehta** for the Sheryians Coding School Authentication & Product CRUD APIs assignment.

## Starter catalog data

For a smoother assignment demo, StockPilot automatically inserts a starter catalog the first time an authenticated session is established while the `products` collection is empty. The starter products are assigned to that authenticated user, so Create, Read, Update and Delete can be demonstrated immediately without manually entering sample records.

Set `SEED_STARTER_PRODUCTS=false` in `server/.env` if you want to disable this behaviour.

## Development session refresh

The client deduplicates simultaneous refresh-token requests. This prevents React development `StrictMode` from sending two refresh requests with the same rotating refresh token and accidentally invalidating the session during a page reload.
