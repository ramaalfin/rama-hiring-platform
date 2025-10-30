# Get Job Platform

## Project Overview

**Link Deploy**
(soon)

**Otentikasi**

Sistem otentikasi untuk aplikasi web **Get Job** memungkinkan pengguna login dan register menggunakan email & password atau melalui **magic link** yang dikirim ke email. Sistem menggunakan **JWT (access token & refresh token)** untuk menjaga sesi tetap aman, dengan mekanisme refresh token untuk perpanjangan akses otomatis.

**Manajemen Job**

Fitur manajemen job memungkinkan admin membuat, mengelola, dan memfilter lowongan pekerjaan. Setiap job hanya dapat diakses dan dikelola oleh admin yang membuatnya.

**Manajemen Applicant**

Modul ini memungkinkan **Job Seeker (Candidate)** melamar pekerjaan melalui form yang dapat menangkap **foto profil** menggunakan kamera dan mengisi data resume seperti:

1. Photo Profile  
2. Full Name  
3. Date of Birth  
4. Pronoun (Gender)  
5. Domicile  
6. Phone Number  
7. Email  
8. LinkedIn URL  

Fitur ini juga:

- Upload foto profil ke Cloudinary (base64 atau file).  
- Validasi agar user tidak melamar pekerjaan yang sama lebih dari sekali.  
- Menampilkan toast error saat user sudah pernah melamar.  

**Key Features Implemented**

- **Login & Register Tradisional** menggunakan email dan password.  
- **Magic Link Authentication** untuk login/register sekali pakai via email.  
- **Refresh Token Mechanism** otomatis saat access token kedaluwarsa.  
- **Zustand Global State** untuk menyimpan data user dan persistensi di `localStorage`.  
- **Secure Email Template** untuk magic link dengan branding Get Job.  
- **Role-Based Access** (`ADMIN`, `USER`) untuk otorisasi halaman.  
- **Job Management** dengan pagination, sorting, search filter, dan validasi keamanan.  

---

## Tech Stack Used

- **Frontend:** Next.js (App Router), Zustand, TanStack Query, React Webcam, TensorFlow Handpose  
- **Backend:** Express.js, Prisma ORM, PostgreSQL Lokal  
- **File & Media:** Cloudinary untuk menyimpan foto profil  
- **Authentication:** JWT (access & refresh token), Magic Link via Nodemailer  
- **UI/UX Enhancements:** Toast Notification, Image Preview, Dynamic Form Validation  

---

## How to Run Locally

1. **Clone Repository**

```bash
git clone https://github.com/ramaalfin/rama-hiring-platform.git
cd rama-hiring-platform
```

2. **Setup Backend**

```bash
Copy code
cd backend
npm install
npx prisma generate
# Setup environment variables
# Contoh .env:
# DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
# GMAIL_USER="your-email@gmail.com"
# GMAIL_PASS="<app password here>"
```

3. **Setup Frontend**

```bash
Copy code
cd ../frontend
npm install
# Setup environment variables
# Contoh .env:
# NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. **Run Services**

```bash
Copy code
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### Additional Steps

1. Setup app password di akun Google: https://myaccount.google.com/apppasswords
2. Masukkan GMAIL_PASS ke environment variable backend.
3. Akses aplikasi di http://localhost:3000.
