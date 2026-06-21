<h1 style="display:flex; align-items:center; gap:5px;">
<img src="./client/public/icon.png" height="30px" > storely
 </h1>

Storely is a cloud-based code storage and management platform designed for developers to securely store, organize, and manage their source code files. The platform provides authentication, role-based access control, administrative monitoring, and secure file management features to create a centralized workspace for development assets.

## 🚀 Features

### User Authentication

- Secure user registration and login
- Google OAuth Authentication
- Session management
- Protected routes
- JWT-based authentication

### Authorization & Security

- Role-Based Access Control (RBAC)
- User and Admin permissions
- Protected APIs
- Secure password hashing
- Middleware-based authorization

### Code Storage System

- Store and manage source code files
- Organize files efficiently
- Cloud-based access
- File metadata management
- Fast retrieval system

### Admin Dashboard

- Monitor registered users
- Manage user permissions
- Track platform activity
- User management tools
- Administrative controls

### User Management

- Profile management
- Account settings
- Role assignment
- Activity monitoring

### Security Features

- Authentication middleware
- Authorization validation
- Protected database operations
- Secure API architecture
- Input validation and sanitization

---

## 🏗️ System Architecture

Storely follows a modern full-stack architecture:

Client (Next.js)
↓
API Layer
↓
Authentication & Authorization
↓
Business Logic Layer
↓
MongoDB Database

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React.js
- TypeScript
- Tailwind CSS
- Shadcn UI

### Backend

- Next.js API Routes
- Node.js
- Express Concepts
- JWT Authentication

### Database

- MongoDB
- Mongoose ODM

### Authentication

- Google OAuth
- JWT
- Session Management

### State Management

- Redux Toolkit
- RTK Query

### Deployment

- Vercel
- MongoDB Atlas

---

## 📂 Database Design

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  image: String,
  role: "user" | "admin",
  provider: String,
  createdAt: Date,
  updatedAt: Date
}
```

### File Collection

```javascript
{
  _id: ObjectId,
  fileName: String,
  fileContent: String,
  ownerId: ObjectId,
  language: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Role Permissions

```javascript
{
  admin: [
    "manage_users",
    "view_all_files",
    "delete_files",
    "assign_roles"
  ],

  user: [
    "create_files",
    "update_own_files",
    "delete_own_files",
    "view_own_files"
  ]
}
```

---

## 🔐 Authentication Flow

1. User signs in using Google OAuth.
2. User identity is verified.
3. JWT token/session is generated.
4. Protected routes validate user access.
5. RBAC middleware checks permissions.
6. Authorized actions are executed.

---

## 📁 Project Structure

```bash
src/
├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── middleware/
├── model/
├── services/
├── store/
├── types/
└── utils/
```

---

## ⚡ Installation

```bash
git clone https://github.com/monushah108/Storely.git

cd Storely

npm install

npm run dev
```

---

## Environment Variables

```env
MONGODB_URI=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=



```

---

## Future Improvements

- Real-time collaboration
- Version history
- Code sharing
- Team workspaces
- File encryption
- Activity logs
- Notifications
- AI-powered code assistance

---

## Author

Monu Shah

Frontend Developer | React Developer | Next.js Developer

GitHub:
https://github.com/monushah108

```

```
