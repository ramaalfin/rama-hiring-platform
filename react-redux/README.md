# Frontend Authentication App

Proyek frontend React TypeScript yang terintegrasi dengan backend authentication menggunakan teknologi modern.

## 🛠️ Teknologi yang Digunakan

- **React 18** - Library frontend modern
- **TypeScript** - Type safety dan developer experience yang lebih baik
- **Vite** - Build tool yang cepat dan modern
- **Redux Toolkit** - State management yang efisien
- **Axios** - HTTP client untuk API calls
- **Zod** - Schema validation untuk form dan API
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

## 📁 Struktur Proyek

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication related components
│   │   └── AuthForm.tsx
│   ├── ui/              # Basic UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Alert.tsx
│   └── ProtectedRoute.tsx
├── config/              # Configuration files
│   └── api.ts          # Axios configuration
├── hooks/               # Custom React hooks
│   └── redux.ts        # Typed Redux hooks
├── pages/               # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Dashboard.tsx
├── schemas/             # Zod validation schemas
│   └── auth.schema.ts
├── services/            # API service layers
│   └── auth.service.ts
├── store/               # Redux store
│   ├── index.ts
│   └── slices/
│       ├── authSlice.ts
│       └── sessionSlice.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── App.tsx
├── App.css
└── main.tsx
```

## 🚀 Instalasi dan Penggunaan

### 1. Clone dan Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd auth-frontend

# Install dependencies
npm install
```

### 2. Konfigurasi Environment

Buat file `.env` di root directory:

```bash
VITE_API_URL=http://localhost:5001/api/v1
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### 4. Build untuk Production

```bash
npm run build
```

## 🔧 Fitur Utama

### Authentication
