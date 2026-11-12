<div align="center">

# ClinicManagement

**Hệ thống Quản lý Phòng khám** — Clinic Management System

[![.NET](https://img.shields.io/badge/.NET_8-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![MySQL](https://img.shields.io/badge/MySQL_8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Ant Design](https://img.shields.io/badge/Ant_Design-0170FE?style=for-the-badge&logo=antdesign&logoColor=white)](https://ant.design/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)

A full-stack clinic management system with role-based access control for Admins, Doctors, Receptionists, and Patients.

> This is a personal learning project. It is public for reference, but it is not currently maintained as a community contribution project.

</div>

---

## Features

| Role | Capabilities |
|---|---|
| **SuperAdmin** | User management, role assignment, system configuration |
| **Doctor** | View appointments, write prescriptions, manage exam records |
| **Receptionist** | Patient intake, appointment scheduling, invoice generation |
| **Patient** | Book appointments, view medical history, manage prescriptions |

**Core modules:** Appointments · Work Schedules · Medical Exam Forms · Prescriptions · Invoices · Service & Medicine Catalogs · Reports (Revenue, Patient Count, Doctor Activity)

---

## Tech Stack

### Backend — `ClinicManagement.Server/`

- **ASP.NET Core Web API** (.NET 8) — layered architecture: Controller → Service → Repository
- **Entity Framework Core** (Code First) + **Pomelo MySQL** driver
- **ASP.NET Core Identity** — users, roles, claims
- **JWT Bearer Auth** — access token + refresh token (HttpOnly cookie)
- **Serilog** — structured logging to console + rolling file
- **AutoMapper** — entity ↔ DTO mapping
- **Swagger / OpenAPI** — auto-generated API docs (dev only)

### Frontend — `ClinicManagement.Client/`

- **React 19** + **Vite 8**
- **Ant Design 6** — UI components
- **React Router v7** — lazy-loaded, role-based routing
- **Axios** — HTTP client with interceptors
- **SCSS** — global stylesheet + role-scoped partials

---

## Project Structure

```
ClinicManagement/
├── ClinicManagement.Server/
│   └── src/
│       ├── ClinicManagement.API/          # Entry point, controllers, DI config
│       ├── ClinicManagement.Services/     # Business logic
│       ├── ClinicManagement.Repositories/ # Data access
│       ├── ClinicManagement.Models/       # EF entities, DbContext, migrations
│       ├── ClinicManagement.DTOs/         # Request/response DTOs + AutoMapper
│       ├── ClinicManagement.Commons/      # Shared enums
│       └── MayNghien.Infrastructures/    # Shared infrastructure library
│
└── ClinicManagement.Client/
    └── src/
        ├── apis/         # One module per domain entity
        ├── pages/        # Admin / Doctor / Receptionist / Patient / Auth
        ├── components/
        ├── layout/
        ├── routers/
        └── scss/
```

---

## Prerequisites

| Tool | Version |
|---|---|
| .NET SDK | 8.0+ |
| Node.js | 18+ |
| MySQL Server | 8.0+ |
| Docker & Docker Compose | (optional) |

---

## Getting Started

### Option A — Visual Studio 2022

#### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/ClinicManagement.git
cd ClinicManagement
```

#### 2. Configure the backend

Open `ClinicManagement.Server/src/ClinicManagement.API/appsettings.json` and fill in your values:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=ClinicManagement;User=root;Password=YOUR_PASSWORD;"
  },
  "Jwt": {
    "Issuer": "ClinicManagement",
    "Audience": "ClinicManagement",
    "Key": "YOUR_SECRET_KEY_MIN_32_CHARS",
    "AccessTokenExpiresIn": 3600,
    "RefreshTokenExpiresIn": 10080
  },
  "AllowedOrigins": ["http://localhost:5173"]
}
```

#### 3. Apply EF Core migrations

Open **Package Manager Console** (Tools → NuGet → Package Manager Console), set the default project to `ClinicManagement.API`, then run:

```powershell
Update-Database
```

Or via CLI from `ClinicManagement.Server/src/`:

```bash
dotnet ef database update --project ClinicManagement.Models --startup-project ClinicManagement.API
```

#### 4. Run the backend

Open `ClinicManagement.Server/src/src.sln` in Visual Studio 2022, set `ClinicManagement.API` as the startup project, and press **F5**.

The API starts at the port shown in `Properties/launchSettings.json`.
Swagger UI is available at `/swagger` in Development mode.

#### 5. Run the frontend

```bash
cd ClinicManagement.Client
npm install
npm run dev
```

The app opens at `http://localhost:5173`.

---

### Option B — VS Code

#### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/ClinicManagement.git
cd ClinicManagement
```

#### 2. Configure the backend

Same as [Step 2 above](#2-configure-the-backend) — edit `appsettings.json`.

#### 3. Apply migrations & run the backend

```bash
cd ClinicManagement.Server/src

# Apply migrations
dotnet ef database update --project ClinicManagement.Models --startup-project ClinicManagement.API

# Start the API
cd ClinicManagement.API
dotnet run
```

Recommended VS Code extensions: **C# Dev Kit**, **ESLint**, **Prettier**.

#### 4. Run the frontend

```bash
cd ClinicManagement.Client
npm install
npm run dev
```

---

### Option C — Docker

> The API ships with a `Dockerfile`. A full `docker-compose.yml` (API + MySQL) is a planned addition — contributions welcome.

#### Build and run the API image manually

```bash
cd ClinicManagement.Server/src/ClinicManagement.API

docker build -t clinicmanagement-api .

docker run -d -p 8080:8080 \
  -e ConnectionStrings__DefaultConnection="Server=host.docker.internal;Port=3306;Database=ClinicManagement;User=root;Password=YOUR_PASSWORD;" \
  -e Jwt__Key="YOUR_SECRET_KEY_MIN_32_CHARS" \
  --name clinicmanagement-api \
  clinicmanagement-api
```

The API is accessible at `http://localhost:8080`.

---

## API Overview

Base URL: `https://localhost:<port>/api`

| Prefix | Description |
|---|---|
| `/auth` | Register, login, refresh token, logout |
| `/bacsi` | Doctor management |
| `/benhnhan` | Patient management |
| `/lichhen` | Appointments |
| `/lichlamviec` | Work schedules |
| `/phieukham` | Medical exam forms |
| `/donthuoc` | Prescriptions |
| `/hoadon` | Invoices |
| `/danhmucdichuv` | Service catalog |
| `/danhmucthuoc` | Medicine catalog |
| `/nhanvien` | Staff management |

Full interactive docs available at `/swagger` when running in Development mode.

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `ConnectionStrings__DefaultConnection` | MySQL connection string | `Server=...;Database=ClinicManagement;...` |
| `Jwt__Key` | JWT signing key (min 32 chars) | `super-secret-key-...` |
| `Jwt__Issuer` | JWT issuer | `ClinicManagement` |
| `Jwt__Audience` | JWT audience | `ClinicManagement` |
| `Jwt__AccessTokenExpiresIn` | Access token lifetime (seconds) | `3600` |
| `Jwt__RefreshTokenExpiresIn` | Refresh token lifetime (minutes) | `10080` |
| `AllowedOrigins__0` | CORS allowed origin | `http://localhost:5173` |

---

## Roles

| Value | Name | Description |
|---|---|---|
| `0` | SuperAdmin | Full system access |
| `1` | BacSi (Doctor) | Clinical features |
| `2` | LeTan (Receptionist) | Front-desk features |
| `3` | BenhNhan (Patient) | Patient self-service |

---

## License

This project is licensed under the [MIT License](LICENSE).
