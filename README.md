Handy Bros – Job Platform
Full-Stack Take-Home Project
A modern job posting platform with a clean API, secure authentication, and a polished frontend UI.
Tech Stack
Backend

ASP.NET Core 8 Web API
Entity Framework Core 8 + Pomelo MySQL Provider
JWT Authentication
SignalR for real-time notifications

Frontend

React
TypeScript
Vite
MUI + TailwindCSS

Database

MySQL
EF Core Code-First + Migrations

Features

User Registration & Login (Poster / Viewer roles)
Posters can Create, Update, Delete Job Posts
Viewers can Express Interest
Pagination, search, filtering
Auto-hide job posts older than 60 days
Real-time notifications on interest (SignalR)
Clean validation and proper status codes
Fully responsive UI

Project Structure
texthbros-platform/
├── backend/
│   └── HandyBrosApi/
│       ├── HandyBrosApi.sln
│       └── HandyBrosApi/
│           ├── HandyBrosApi.csproj
│           ├── Program.cs
│           ├── Controllers/
│           ├── Models/
│           ├── Data/
│           └── ...
└── frontend/
    ├── package.json
    ├── vite.config.ts
    └── src/
Important: When downloading via GitHub ZIP, an extra folder layer is added.
Always navigate into the second hbros-platform-main folder before running commands.
Running the Project
1. Backend (ASP.NET Core 8)
Prerequisites

.NET 8 SDK
dotnet-ef 8.x (do not use 10.x)

PowerShell# Install EF Core tool (run once)
dotnet tool install --global dotnet-ef --version 8.0.10
Option A – CLI (Recommended)
PowerShellcd backend/HandyBrosApi

# Restore packages
dotnet restore

# Apply migrations
dotnet ef database update --project HandyBrosApi/HandyBrosApi.csproj

# Run the API
dotnet run --project HandyBrosApi/HandyBrosApi.csproj
Backend will start on (port shown in console):
texthttp://localhost:5174   (HTTP)
https://localhost:7116  (HTTPS)
Option B – Visual Studio 2022

Open backend/HandyBrosApi/HandyBrosApi.sln
Set HandyBrosApi as startup project
Press F5

Fixing the Port (Optional)
PowerShelldotnet run --project HandyBrosApi/HandyBrosApi.csproj --urls "https://localhost:7116"
or edit backend/HandyBrosApi/HandyBrosApi/Properties/launchSettings.json
2. Frontend (React + Vite + MUI)
PowerShellcd frontend

npm install
npm run dev
Frontend runs on: http://localhost:3000
3. Configure Frontend Proxy
Edit frontend/vite.config.ts and set the correct backend port (match your console output):
TypeScriptserver: {
  proxy: {
    "/api": {
      target: "http://localhost:7116",   // ← change to your actual backend port by default i set 7116
      changeOrigin: true,
      secure: false
    }
  }
}
