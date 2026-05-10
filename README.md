# 📚 Knowledge Hub

A full-stack **Personal Knowledge Management** application that lets you organize, store, and access all your knowledge resources — links, articles, files, images, and videos — in one clean, premium interface.

---

## ✨ Features

- **Multi-Type Resources** — Save links, articles, files, images, and videos in a unified library
- **Tag-Based Organization** — Tag resources for quick filtering and categorization
- **Full-Text Search** — Search across all resources by title with real-time results
- **Pagination** — Configurable per-page limits (5, 10, 20, 50) with URL-driven state
- **File Uploads** — Upload images, videos, and documents with cloud storage
- **CRUD Operations** — Create, read, update, and delete resources with confirmation dialogs
- **Authentication** — Secure JWT-based auth with signup, login, and protected routes
- **Dark Theme** — Premium dark-first UI with glassmorphism, micro-animations, and gradient accents
- **Responsive Layout** — Works across desktop and tablet screen sizes

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Accessible UI component library |
| **TanStack React Query** | Server state management & caching |
| **React Hook Form + Zod** | Form handling with schema validation |
| **Zustand** | Lightweight client state management |
| **Axios** | HTTP client |
| **Sonner** | Toast notifications |
| **Lucide React** | Icon library |
| **date-fns** | Date formatting |

### Backend

| Technology | Purpose |
|------------|---------|
| **FastAPI** | Python web framework |
| **MongoDB (PyMongo)** | NoSQL database |
| **Python-Jose** | JWT token handling |
| **Passlib + Bcrypt** | Password hashing |
| **Pydantic** | Request/response validation |
| **Uvicorn** | ASGI server |
| **Python-Multipart** | File upload handling |

---

## 📁 Project Structure

```
assignment/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── config/              # Database & environment config
│   │   ├── routes/
│   │   │   ├── auth_routes.py   # Login, signup, logout, current user
│   │   │   ├── resource_route.py # CRUD for resources
│   │   │   └── upload_route.py  # File/image/video uploads
│   │   ├── services/
│   │   │   ├── auth_service.py  # Auth business logic
│   │   │   ├── resource_service.py # Resource business logic
│   │   │   └── upload_service.py   # Upload handling
│   │   ├── schemas/             # Pydantic models
│   │   ├── middleware/          # Auth middleware
│   │   ├── dependencies/        # Dependency injection
│   │   └── utils/               # JWT & utility helpers
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Landing page
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── globals.css      # Design system & theme
│   │   │   ├── (auth)/
│   │   │   │   ├── login/       # Login page
│   │   │   │   └── signup/      # Signup page
│   │   │   ├── dashboard/
│   │   │   │   ├── layout.tsx   # Dashboard shell (sidebar + content)
│   │   │   │   └── page.tsx     # Resource grid with filters
│   │   │   └── resource/
│   │   │       └── [id]/        # Resource detail viewer
│   │   ├── components/
│   │   │   ├── dashboard/       # Sidebar
│   │   │   ├── resource/        # Cards, modals, skeletons
│   │   │   ├── shared/          # Protected route wrapper
│   │   │   └── ui/              # shadcn/ui components
│   │   ├── hooks/               # React Query hooks
│   │   ├── services/            # Axios API services
│   │   ├── schemas/             # Zod validation schemas
│   │   ├── types/               # TypeScript interfaces
│   │   ├── lib/                 # Utility functions
│   │   └── providers/           # React Query provider
│   ├── package.json
│   └── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Python** 3.10+
- **MongoDB** (local or Atlas)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd assignment
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your config
# (MONGO_URI, JWT_SECRET, etc.)

# Start the server
uvicorn app.main:app --reload
```

The API will be running at **http://localhost:8000**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be running at **http://localhost:3000**

---

## 🔌 API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/login` | Login and receive JWT token |
| `POST` | `/auth/logout` | Logout and clear token |
| `GET` | `/auth/me` | Get current authenticated user |

### Resources

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/resources` | List resources (search, filter, paginate) |
| `GET` | `/resources/:id` | Get a single resource |
| `POST` | `/resources` | Create a new resource |
| `PUT` | `/resources/:id` | Update a resource |
| `DELETE` | `/resources/:id` | Delete a resource |
| `GET` | `/resources/tags` | Get all unique tags |

### Uploads

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload/image` | Upload an image |
| `POST` | `/upload/video` | Upload a video |
| `POST` | `/upload/file` | Upload a document/file |

---


