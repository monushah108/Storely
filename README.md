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

## 📸 Screenshots

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

Storely is a cloud-based file storage and management platform designed to provide users with a simple and secure place to upload, organize, manage, and share their files.

The platform includes user authentication, cloud file storage, file and folder management, sharing functionality, storage quota tracking, and an administrative system for managing users and platform activity.

Storely focuses on keeping file management **simple, clean, and easy to use**.

---

## 🚀 Features

### 🔐 User Authentication

- User registration and login
- Google OAuth authentication
- GitHub OAuth authentication
- Session management
- Protected routes
- Secure authentication flow
- Password-based authentication

### 📁 File Management

- Upload files
- View files and folders
- Create directories
- Rename files and folders
- Delete files and folders
- Open files
- File metadata management
- File type detection
- File size information

### ☁️ Cloud Storage

- Cloudinary-based file storage
- Secure file uploads
- Cloud-based file access
- File storage quota
- Used storage tracking
- Remaining storage calculation

### 🔗 File Sharing

- Share files with others
- Generate accessible file links
- Guest file access

### 👤 User Management

- User profile
- Profile image
- Email information
- Storage usage
- Account management
- Logout functionality

### 🛡️ Security

- Protected API routes
- Authentication middleware
- Authorization checks
- Secure password handling
- Environment-based secrets
- Input validation
- Protected database operations

### 👨‍💻 Admin Dashboard

- Monitor users
- Manage user accounts
- Manage permissions
- Monitor platform activity
- Administrative controls

---

# 🏗️ System Architecture

Storely follows a client-server architecture.

```text
┌─────────────────────┐
│      React Client   │
│                     │
│  React Router       │
│  Redux Toolkit      │
│  RTK Query          │
│  Tailwind CSS       │
└──────────┬──────────┘
           │
           │ HTTP / API
           ▼
┌─────────────────────┐
│      Backend        │
│                     │
│  Node.js / Express  │
│  Authentication     │
│  Authorization      │
│  File Management    │
└──────────┬──────────┘
           │
      ┌────┴─────┐
      ▼          ▼
┌──────────┐ ┌────────────┐
│ MongoDB  │ │ Cloudinary │
│ Database │ │ File Store │
└──────────┘ └────────────┘
```
