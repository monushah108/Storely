<h1 align="center">
  <img src="./folderDriver client/public/icon.png" height="35" align="center" />
  Storely
</h1>

<p align="center">
  A simple cloud-based file storage and management platform.
</p>

<p align="center">
  Store, organize, manage, and share your files securely from one place.
</p>

---

### 🏠 Home Page

<p align="center">
  <img src="folderDriver client/public/home.png" alt="Storely Home Page" width="900" />
</p>

### 🔐 Login

<p align="center">
  <img src="./folderDriver client/public/login.png" alt="Storely Login Page" width="700" />
</p>

### 📁 Dashboard

<p align="center">
  <img src="./folderDriver client/public/dashboard.png" alt="Storely Dashboard" width="900" />
</p>

---

# 📦 About Storely

**Storely** is a full-stack cloud file management application built with **React, Node.js, Express, MongoDB, and Cloudinary**.

It allows users to securely upload, organize, manage, and share files through a modern web interface. Storely also supports **Google and GitHub OAuth authentication**, role-based access control, directories, file sharing, and an administrative dashboard.

<p align="center">
  <strong>Built with ❤️ using React, Node.js, MongoDB and Cloudinary.</strong>
</p>

---

## ✨ Features

### 👤 Authentication

- Email/password authentication
- Google OAuth login
- GitHub OAuth login
- JWT/session-based authentication
- Protected routes
- Secure password hashing

### 📁 File Management

- Upload files
- View uploaded files
- Update file information
- Delete files
- File metadata management
- Cloudinary-based file storage

### 📂 Directory Management

- Create directories
- Organize files into folders
- Navigate directory contents
- Nested directory support

### 🔗 File Sharing

- Share files with other users
- Guest/shared file access
- Public file viewing through share links

### 🛡️ Admin Dashboard

Administrators can:

- Manage users
- View users
- Manage files
- Delete files
- Assign user roles

### 🔐 Security

- Authentication middleware
- Authorization middleware
- Protected API endpoints
- JWT/session validation
- OAuth authentication
- Environment-based secrets
- Input validation
- Owner-level file authorization
- Role-based permission checks

---

## 🏗️ Project Structure

```text
Storely/
│
├── folderDriver client/
│   ├── public/
│   │   └── icon.png
│   │
│   └── src/
│       ├── admin/
│       ├── components/
│       ├── hook/
│       ├── models/
│       ├── pages/
│       ├── store/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── docs/
│   └── screenshots/
│       ├── home.png
│       ├── login.png
│       └── dashboard.png
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack

|                                                          Technology                                                           | Purpose                           |
| :---------------------------------------------------------------------------------------------------------------------------: | --------------------------------- |
|        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="30" alt="React">         | Frontend UI                       |
|          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg" width="30" alt="Vite">          | Frontend development & build tool |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="30" alt="JavaScript"> | Application logic                 |
|      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="30" alt="Node.js">       | Backend runtime                   |
|    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="30" alt="Express.js">    | REST API                          |
|     <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="30" alt="MongoDB">      | Database                          |
|    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongoose/mongoose-original.svg" width="30" alt="Mongoose">    | MongoDB ODM                       |
|                                                                                                                               | File & image storage              |
|                                                                                                                               | Authentication                    |
|       <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" width="30" alt="Google">       | Social authentication             |
|       <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="30" alt="GitHub">       | Social authentication             |
|                                                                                                                               | Frontend deployment               |
|                                                                                                                               | Backend deployment                |
|  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="30" alt="MongoDB Atlas">   | Cloud database                    |

---

## 🔑 Environment Variables

Create a `.env` file in the appropriate project directory and configure the following variables:

```env
VITE_API_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

CLOUDNARY_NAME=
CLOUDNARY_API_KEY=
CLOUDNARY_API_SECRET=

SECRET_KEY=

MONGODB_URI=

GITHUB_CALLBACK_UR=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### Environment Variable Reference

| Variable               | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `VITE_API_URL`         | Base URL of the backend API used by the frontend |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID                           |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret                       |
| `CLOUDNARY_NAME`       | Cloudinary cloud name                            |
| `CLOUDNARY_API_KEY`    | Cloudinary API key                               |
| `CLOUDNARY_API_SECRET` | Cloudinary API secret                            |
| `SECRET_KEY`           | Secret used for authentication/token security    |
| `MONGODB_URI`          | MongoDB connection string                        |
| `GITHUB_CALLBACK_UR`   | GitHub OAuth callback URL                        |
| `GITHUB_CLIENT_ID`     | GitHub OAuth client ID                           |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret                       |

> ⚠️ **Security:** Never commit `.env` files or expose API secrets, OAuth secrets, database credentials, or other sensitive environment variables publicly.

Recommended `.gitignore` entries:

```gitignore
.env
.env.local
.env.*.local
```

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/monushah108/Storely.git
```

### 2. Navigate to the project

```bash
cd Storely
```

### 3. Install root dependencies

```bash
npm install
```

### 4. Install frontend dependencies

```bash
cd "folderDriver client"
npm install
```

### 5. Install backend dependencies

```bash
cd ../server
npm install
```

---

## ▶️ Running Locally

Storely consists of two applications:

- Frontend — React/Vite
- Backend — Node.js/Express

### Frontend

From the frontend directory:

```bash
cd "folderDriver client"
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

### Backend

Open another terminal:

```bash
cd server
npm run dev
```

The backend will normally run at:

```text
http://localhost:8000
```

---

## 🌐 Application Routes

| Route            | Description         |
| ---------------- | ------------------- |
| `/`              | Storely home page   |
| `/login`         | User login          |
| `/auth/register` | User registration   |
| `/dashboard`     | User file dashboard |
| `/dirItem/:id`   | Directory contents  |
| `/file/:id`      | File view           |
| `/guest/:id`     | Shared/guest file   |
| `/admin/*`       | Admin dashboard     |

---

## 🔐 Authentication Flow

```text
                    Storely
                       │
                       ▼
              ┌─────────────────┐
              │ Login / Register│
              └────────┬────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
        Email        Google       GitHub
        Login        OAuth        OAuth
          │            │            │
          └────────────┼────────────┘
                       ▼
              ┌─────────────────┐
              │ Authentication  │
              └────────┬────────┘
                       ▼
              ┌─────────────────┐
              │ Session / JWT   │
              └────────┬────────┘
                       ▼
              ┌─────────────────┐
              │ Protected Routes│
              └────────┬────────┘
                       ▼
              ┌─────────────────┐
              │    Dashboard    │
              └─────────────────┘
```

---

## 📤 File Upload Flow

```text
User
 │
 ▼
Select File
 │
 ▼
Upload Request
 │
 ▼
Authentication Check
 │
 ▼
File Validation
 │
 ▼
Cloudinary
 │
 ▼
File URL + Metadata
 │
 ▼
MongoDB
 │
 ▼
Storely Dashboard
```

---

## 🗄️ Database Design

### User Collection

```js
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

```js
{
  _id: ObjectId,
  name: String,
  extension: String,
  size: Number,
  url: String,
  ownerId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Directory Collection

```js
{
  _id: ObjectId,
  name: String,
  ownerId: ObjectId,
  parentId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🛡️ Role-Based Permissions

### Admin

```js
["manage_users", "view_users", "manage_files", "delete_files", "assign_roles"];
```

### User

```js
[
  "upload_files",
  "create_directories",
  "update_own_files",
  "delete_own_files",
  "view_own_files",
  "share_files",
];
```

---

## 🔒 Security

Storely uses multiple layers of security to protect users and their files:

- Authentication middleware
- Authorization middleware
- Protected API endpoints
- Password hashing
- JWT/session validation
- OAuth authentication
- Environment-based secrets
- Input validation
- Protected database operations
- User-level file authorization
- Admin-level permission checks

---

## ☁️ Deployment

### Frontend

The React/Vite frontend can be deployed using:

- Vercel
- Other platforms supporting Vite applications

### Backend

The Node.js/Express backend can be deployed using:

- Render
- Other Node.js-compatible hosting platforms

### Database

Use:

- MongoDB Atlas

### File Storage

Use:

- Cloudinary

Before deploying, configure all required environment variables in your hosting provider.

For production, update the frontend environment variable:

```env
VITE_API_URL=https://your-production-api-url.com
```

---

## 🔄 Application Flow

```text
                         Storely
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
             Guest User              Auth User
                                        │
                                        ▼
                                  ┌───────────┐
                                  │ Dashboard │
                                  └─────┬─────┘
                                        │
                     ┌──────────────────┼──────────────────┐
                     │                  │                  │
                     ▼                  ▼                  ▼
                   Files             Folders            Sharing
                     │                  │
                     └────────┬─────────┘
                              ▼
                         Cloudinary
                              │
                              ▼
                           MongoDB
```

---

## 📌 Future Improvements

Potential improvements for future versions include:

- File preview support
- Drag-and-drop uploads
- File search and filtering
- Storage usage analytics
- File versioning
- Trash/recycle bin
- Advanced sharing permissions
- Email notifications
- Activity history
- Improved admin analytics
- Responsive mobile experience

---

## 🧪 Development Notes

For local development, make sure:

1. MongoDB is accessible.
2. Cloudinary credentials are configured.
3. Google OAuth credentials are configured if Google login is enabled.
4. GitHub OAuth credentials are configured if GitHub login is enabled.
5. Frontend and backend environment variables are correctly configured.
6. Both frontend and backend servers are running.

---

## 📄 License

This project is currently available for **educational and development purposes**.

---

## 👨‍💻 Author

### Monu Shah

**Frontend Developer | React Developer | Full-Stack Developer**

GitHub: `monushah108/Storely`

---

<p align="center">
  Built with ❤️ using React, Node.js, MongoDB and Cloudinary.
</p>
