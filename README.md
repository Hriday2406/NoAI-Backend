# NoAI-Backend
Backend for RAG + LLM wrapper - Node.js + Express + MongoDB API

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **MVC Architecture**: Clean separation of concerns with Models, Views, and Controllers
- **MongoDB Integration**: Mongoose ODM for database operations
- **Security**: Password hashing, JWT tokens, CORS protection
- **Error Handling**: Centralized error handling middleware
- **Input Validation**: Mongoose schema validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment Management**: dotenv
- **CORS**: cors middleware

## Project Structure

```
├── app.js                 # Main application file
├── config/
│   └── db.js              # Database connection
├── controllers/
│   └── authController.js  # Authentication logic
├── middleware/
│   ├── auth.js            # Authentication & authorization middleware
│   └── errorHandler.js    # Error handling middleware
├── models/
│   └── User.js            # User model/schema
├── routes/
│   ├── auth.js            # Authentication routes
│   └── users.js           # User management routes
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Installation & Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd NoAI-Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
# Edit .env file with your configuration
```

4. **Start MongoDB**
Make sure MongoDB is running on your local machine or update the `MONGODB_URI` in .env

5. **Run the application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/noai-backend |
| `JWT_SECRET` | JWT secret key | (required) |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `NODE_ENV` | Environment mode | development |

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
- **POST** `/api/auth/register`
- **Body**: `{ name, email, password }`
- **Response**: User object + JWT token

#### Login User
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: User object + JWT token

#### Get Current User
- **GET** `/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Current user information

#### Update Profile
- **PUT** `/api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ name?, email? }`
- **Response**: Updated user information

### User Management Routes (`/api/users`) - Admin Only

#### Get All Users
- **GET** `/api/users`
- **Headers**: `Authorization: Bearer <token>` (Admin required)
- **Response**: List of all users

#### Get User by ID
- **GET** `/api/users/:id`
- **Headers**: `Authorization: Bearer <token>` (Admin required)
- **Response**: User information

#### Delete User
- **DELETE** `/api/users/:id`
- **Headers**: `Authorization: Bearer <token>` (Admin required)
- **Response**: Success message

### Utility Routes

#### Health Check
- **GET** `/api/health`
- **Response**: API status

#### Welcome
- **GET** `/`
- **Response**: API information

## Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get current user (with token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Features

- Password hashing using bcryptjs with salt
- JWT-based authentication
- Role-based access control (user/admin)
- Input validation using Mongoose schemas
- CORS protection
- Environment-based configuration

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Adding New Routes
1. Create controller in `controllers/`
2. Create route file in `routes/`
3. Import and use in `app.js`

### Adding New Models
1. Create model file in `models/`
2. Define Mongoose schema with validation
3. Export the model

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC
