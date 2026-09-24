# ☁️ Storely Frontend (Client)

<p align="center">
  <img src="public/icon.png" alt="Storely Logo" width="64" height="64" />
</p>

<p align="center">
  <strong>Modern, responsive cloud file storage and drive web application built with React, Vite, and Tailwind CSS.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-RTK_Query-764ABC?logo=redux&logoColor=white" alt="Redux Toolkit" />
  <img src="https://img.shields.io/badge/React_Router-v7.0-CA4245?logo=reactrouter&logoColor=white" alt="React Router" />
</p>

---

## 📖 Overview

The **Storely Client** is the frontend single-page application (SPA) for the Storely cloud storage platform. Inspired by Google Drive's material design system, it delivers a fluid, responsive, and intuitive interface for managing, browsing, and sharing files and directories across desktop, tablet, and mobile devices.

---

## ✨ Key Features

### 🌓 Theme Switcher Engine (Dark / Light / System)
- **Tri-State Theme System**: Seamless toggle between **Light**, **Dark**, and **System** (OS preference) modes.
- **Instant Zero-Flicker Persistence**: Preserves user choice in `localStorage` (`storely_theme`) and applies classes synchronously before render.
- **Dynamic OS Listener**: Automatically reacts to system theme changes via `window.matchMedia('(prefers-color-scheme: dark)')` when System mode is active.
- **Tailwind CSS v4 Compatibility**: Native dark mode support using `@custom-variant dark (&:where(.dark, .dark *));` in `App.css`.
- **Reusable `ThemeToggle`**: Flexible component supporting compact toggle pills, dropdown menus, and accessibility labels.

### 🔍 Advanced File Previewer (`/file/:id`)
- **Frosted Glass Floating Header**: Modern canvas with quick-access metadata pills (file size, format tag, upload date).
- **Interactive Image Inspection**:
  - Zoom in (`+`), Zoom out (`-`), and Reset to 100% scale.
  - 90-degree clockwise image rotation button.
  - Interactive panning in zoom mode.
- **Theater & Fullscreen Mode**: Toggle fullscreen for distraction-free media inspection.
- **Multi-Format Native Viewers**:
  - High-resolution images (PNG, JPG, SVG, WebP, GIF) with responsive scaling.
  - HTML5 video player (MP4, WebM, MOV) with full player controls.
  - Audio waveform player (MP3, WAV, AAC, M4A) with centered track graphics.
  - Native embedded PDF viewer with one-click **Google Docs viewer fallback**.
  - Direct download links for unsupported binary or archive files.
- **Share & Copy**: One-click preview link copier with instant toast notification.

### 🌐 Public Guest Sharing Experience (`/guest/:id`)
- **Hero Sharing Banner**: Displays shared file/folder identity, total size, item count, and owner profile avatar.
- **Comprehensive Folder Explorer (`GuestFolderView`)**:
  - **Category Filter Pills**: Quickly isolate *Documents*, *Images*, *Media*, or *Archives* with live item counters.
  - **Live Search**: Instant real-time filter by file or directory name.
  - **Flexible Sorting**: Sort by newest, oldest, name (A-Z / Z-A), and size (largest / smallest).
  - **Grid & List Views**: Switch between image preview tiles and structured metadata rows.
- **Interactive File Preview Modal**: Guest users can preview images, videos, audio, and documents inline with Esc-key closing without downloading or logging in.

### 🚀 Enterprise SEO Architecture
- **Dynamic `<SEO />` Component**: Declarative head tags managed via `@unhead/react`.
- **Social Sharing Previews**: Auto-generates OpenGraph (`og:title`, `og:description`, `og:image`, `og:url`) and Twitter Cards.
- **Structured Data**: Auto-injects Google-compliant Schema.org JSON-LD (`WebApplication` / `BreadcrumbList`).
- **Crawler Optimization**: Pre-configured `sitemap.xml` and `robots.txt` ensuring public discovery while strictly enforcing `noIndex` on `/admin/*` and private pages.

### 📂 Drive Dashboard
- **Google Drive Design**: Material design aesthetics with quick-access action drawer, sidebar navigation, and crisp typography.
- **Dual View Modes**: Switch seamlessly between **Grid View** (with image previews and file-type badges) and **List View** (compact tabular data with metadata).
- **Sorting & Filtering**: Dynamic real-time sorting by Name, Date Modified, and File Size, with ascending/descending toggles.
- **Interactive Breadcrumbs**: Breadcrumb path tracking with direct ancestor jumping and one-click back navigation.
- **Drag-and-Drop & Upload Widget**: Upload files directly via drag-and-drop or file pickers with background progress status monitoring.
- **Context Menus & Actions**: Quick right-click or tap access to download, rename, share, and delete actions.
- **File Details Drawer**: Inspect detailed file metadata (size, upload timestamp, file extension, and full previews).

### 📱 Responsive Mobile Experience
- **Expandable Mobile Search**: Header adapts to small viewports with a tap-to-expand search overlay, auto-focus input, and instant clear buttons.
- **Touch-Friendly Navigation**: Collapsible navigation sidebar drawer, accessible tap targets for options and actions, and backdrop dismissal.
- **Adaptive Layouts**: Responsive grid systems and table columns that dynamically adjust without horizontal page overflow.

### 🛡️ Admin Portal (RBAC)
- **Role-Based Access Control**: Dedicated portal for administrators and owners.
- **User Directory Management**: Inspect active and registered users, view login status, and search users.
- **User Lifecycle**: Soft-delete, recover, or permanently hard-delete user accounts and clean up linked cloud resources.
- **Role Delegation**: Owner-level interface for promoting users to administrators and updating administrative credentials.
- **Admin File Explorer**: Administrative view to inspect user directories and file systems.

### 🔐 Authentication & Protected Routes
- **Multi-Method Login**: Supports Email/Password credentials, Google OAuth, and GitHub OAuth.
- **Separate Route Guards**: Dedicated `UserProtectedRoute` and `ProtectedRoutes` for admin security and unauthorized redirects.
- **User Profile Management**: Dropdown menu displaying cloud storage quotas, usage progress percentages, and account details.

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| **Framework & Runtime** | [React 18](https://react.dev/) with [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with Vanilla CSS enhancements |
| **State & Data Fetching** | [Redux Toolkit](https://redux-toolkit.js.org/) & [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Iconography** | [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |
| **Authentication** | [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google) |
| **Social Sharing** | [react-share](https://github.com/nygardk/react-share) |

---

## 📁 Directory Structure

```text
folderDriver client/
├── public/                 # Static public assets (icons, images, logos)
├── src/
│   ├── Api/                # API base configurations and endpoints
│   ├── admin/              # Admin Portal views, modules, and routes
│   │   ├── components/     # Admin tables, action modals, and navigation
│   │   ├── pages/          # Users, File Explorer, Access, Staff, Settings
│   │   └── routes/         # Private admin route definitions
│   ├── components/
│   │   ├── auth/           # Login, Register, OAuth, and Password forms
│   │   ├── dashboard/      # DriveHeader, Sidebar, Toolbar, Breadcrumbs,
│   │   │                   # FileGridView, FileListView, FolderGrid,
│   │   │                   # FileDetailsDrawer, SharedSection, ContextMenu
│   │   ├── home/           # Landing page components & sections
│   │   ├── models/         # Global modals (ShareModal, EditModals)
│   │   └── ui/             # Core UI components (Profile, Buttons, Toasts)
│   ├── hook/               # Custom utility hooks (RenderFileIcon, etc.)
│   ├── pages/              # Application routes (Home, DirectoryView, FileView, Guest, Auth)
│   ├── store/              # Redux slices and RTK Query APIs
│   │   └── slices/         # AdminSlice, Flieslice, UserSlice
│   ├── App.jsx             # Router definition and route orchestration
│   ├── main.jsx            # Application entry point & Provider hierarchy
│   └── directoryView.jsx   # Core Drive Dashboard view container
├── .env                    # Environment variable configuration
├── index.html              # HTML template & portal root
├── package.json            # Dependencies and scripts
└── vite.config.js          # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- Running instance of the **Storely Server** backend.

### 1. Installation
Clone the repository and install the client dependencies:

```bash
cd "folderDriver client"
npm install
```

### 2. Configure Environment Variables
Create or verify your `.env` file in the `folderDriver client` root:

```env
# Backend API Base URL
VITE_API_URL="http://localhost:8000"

# Frontend Application URL
CLIENT_URL="http://localhost:5173"

# Google OAuth Client ID (optional, for Google Sign-In)
VITE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
```

### 3. Start Development Server
Run Vite's development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be accessible at:
```
http://localhost:5173
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite development server with `--host` enabled |
| `npm run build` | Compiles and optimizes assets into the `dist/` production bundle |
| `npm run preview` | Locally serves and previews the production build |
| `npm run lint` | Runs ESLint to identify code quality and style issues |

---

## 🗺️ Key Client Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Marketing landing page showcasing Storely features |
| `/auth/login` | Public | User sign-in with Email, Google, or GitHub |
| `/auth/register` | Public | New account registration |
| `/dashboard` | Authenticated | Main Cloud Drive dashboard (root directory) |
| `/dashboard/dirItem/:id` | Authenticated | Nested folder view for directory `:id` |
| `/guest/:id` | Public | Public guest access view for shared files and folders |
| `/file/:id` | Authenticated | Dedicated single-file viewer and inspector |
| `/admin` | Admin / Owner | Administrative control center & user directory |
| `/admin/access` | Owner | Admin access token generation and credential controls |
| `/admin/deleted` | Admin / Owner | Soft-deleted user accounts recovery portal |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).
