# StockPilot API Reference

Base URL locally: `http://localhost:5001/api`

## Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Create a user account |
| POST | `/auth/login` | Public | Authenticate and issue access + refresh tokens |
| POST | `/auth/refresh-token` | Refresh cookie | Rotate refresh token and issue a new access token |
| POST | `/auth/logout` | Access token | Revoke refresh token and clear cookie |
| GET | `/auth/me` | Access token | Return authenticated user's profile |

### Register body

```json
{
  "name": "Aayush Mehta",
  "email": "aayush@example.com",
  "password": "StrongPass1",
  "confirmPassword": "StrongPass1"
}
```

### Login body

```json
{
  "email": "aayush@example.com",
  "password": "StrongPass1"
}
```

### Authorization header

```http
Authorization: Bearer ACCESS_TOKEN
```

## Products

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/products` | Authenticated | Create product |
| GET | `/products` | Public | List products |
| GET | `/products/:id` | Public | Get product |
| PUT | `/products/:id` | Authenticated + owner | Replace editable product fields |
| DELETE | `/products/:id` | Authenticated + owner | Delete product |

### Product body

```json
{
  "name": "Mechanical Keyboard",
  "description": "A compact hot-swappable mechanical keyboard.",
  "category": "Accessories",
  "price": 4999,
  "stock": 20,
  "imageUrl": "https://example.com/keyboard.jpg"
}
```

### Product list query parameters

```text
GET /api/products?search=keyboard&category=Accessories&page=1&limit=12
```

`page` must be at least 1 and `limit` must be from 1 to 50.
