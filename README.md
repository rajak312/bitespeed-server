# Bitespeed Backend

This is the backend API service for the Bitespeed identity reconciliation project, built with NestJS and Prisma. It provides endpoints to identify contacts by email and/or phone number.

Deployment

This project is deployed online on Render:

Live API URL: [https://bitespeed-server.onrender.com](https://bitespeed-server.onrender.com)


## Features

- Identify users by email and/or phone number
- Merge duplicate contacts
- Uses PostgreSQL as the database
- Deployed on Render.com

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm or npm
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bitespeed-server.git
cd bitespeed-server
```

API Usage
POST /identify

Identify a contact by email and/or phone number.

Headers:
  ```bash
        Content-Type: application/json

```

Body:
```bash
{
  "email": "user@example.com",
  "phoneNumber": "1234567890"
}
```

Example curl Request
```bash
curl -X POST https://bitespeed-server.onrender.com/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "mcfly@hillvalley.edu", "phoneNumber": "123456"}'
```
