# LocalBiz Backend API

MongoDB-based backend for the LocalBiz application.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start MongoDB locally or update MONGODB_URI in .env

3. Start server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Businesses
- `GET /api/businesses` - Get all businesses (with filters)
- `GET /api/businesses/:id` - Get business by ID
- `POST /api/businesses` - Create business (auth required)
- `PUT /api/businesses/:id` - Update business (auth required)
- `DELETE /api/businesses/:id` - Delete business (auth required)

### Users
- `GET /api/users/profile` - Get user profile (auth required)
- `GET /api/users/businesses` - Get user's businesses (auth required)

## Environment Variables

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/localbiz
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```
