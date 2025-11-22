# Handy Bros – Job Platform  
**Full-Stack Take-Home Project**

A modern job posting platform with a clean API, secure authentication, and a polished frontend UI.

### Tech Stack

**Backend**  
- ASP.NET Core 8 Web API  
- Entity Framework Core 8 + Pomelo MySQL Provider  
- JWT Authentication  
- SignalR for real-time notifications  

**Frontend**  
- React + TypeScript  
- Vite  
- MUI + TailwindCSS  

**Database**  
- MySQL (EF Core Code-First + Migrations)

### Features
- User Registration & Login (Poster / Viewer roles)  
- Posters: Create, Update, Delete Job Posts  
- Viewers: Express Interest in jobs  
- Pagination, search & filtering  
- Auto-hide jobs older than 60 days  
- Real-time notifications via SignalR  
- Clean validation & proper HTTP status codes  
- Fully responsive UI  

### Project Structure
hbros-platform-main/                  ← After extracting GitHub ZIP
├── backend/
│   └── HandyBrosApi/
│       ├── HandyBrosApi.sln
│       └── HandyBrosApi/              ← Actual project folder
│           ├── HandyBrosApi.csproj
│           ├── Program.cs
│           ├── Controllers/
│           ├── Models/
│           ├── Data/
│           ├── Services/
│           ├── Properties/
│           ├── appsettings.json
│           └── ...
│
└── frontend/
├── package.json
├── vite.config.ts
├── index.html
├── tsconfig.json
└── src/
├── App.tsx
├── main.tsx
├── components/
├── pages/
├── services/
└── ...
text> **Note**: When you download the repo as ZIP from GitHub, you get an extra top-level folder (`hbros-platform-main`).  
> Always `cd` into the **inner** `hbros-platform-main` folder before running commands.

### Running the Project

#### 1. Backend (.NET 8 API)

**Prerequisites**  
- .NET 8 SDK  
- `dotnet-ef` version **8.x** (do **not** use 10.x)

powershell
# Install correct EF Core tools (run once globally)
dotnet tool install --global dotnet-ef --version 8.0.10
Using CLI (Recommended)
PowerShellcd backend/HandyBrosApi

dotnet restore

# Apply database migrations
dotnet ef database update --project HandyBrosApi/HandyBrosApi.csproj

# Run the API
dotnet run --project HandyBrosApi/HandyBrosApi.csproj
Backend runs on (check console output):
http://localhost:5174 → HTTP
https://localhost:7116 → HTTPS
Force fixed port (optional)
PowerShelldotnet run --project HandyBrosApi/HandyBrosApi.csproj --urls "https://localhost:7116"
Or open in Visual Studio
→ Open backend/HandyBrosApi/HandyBrosApi.sln → Press F5
2. Frontend (React + Vite)
PowerShellcd frontend

npm install
npm run dev
Frontend runs on: http://localhost:3000
3. Connect Frontend → Backend (Proxy Setup)
Edit frontend/vite.config.ts:
TypeScriptserver: {
  proxy: {
    "/api": {
      target: "http://localhost:5174",   // ← Change to your actual backend HTTP port
      changeOrigin: true,
      secure: false
    }
  }
}
