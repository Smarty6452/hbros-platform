# Handy Bros – Job Platform  
**Full-Stack Take-Home Project**

A clean, modern job posting platform built with:

### Tech Stack
- **Backend**: ASP.NET Core 8 Web API  
- **Frontend**: React + TypeScript + Vite + MUI  
- **Database**: MySQL (Entity Framework Core + Pomelo)  
- **Auth**: JWT Authentication + Role-based Authorization  
- **Real-time**: SignalR (Bonus)

### Features Implemented
- User registration & login (Poster / Viewer roles)
- Create, edit, delete jobs (only by owner)
- Express interest in jobs
- Jobs auto-hidden after 2 months
- Pagination, filtering & search
- Clean REST API with proper validation
- Responsive & polished UI with MUI
- Real-time notifications when someone shows interest

### Project Structure
handy-bros-job-platform/
├── backend/          → ASP.NET Core 8 API (JWT, EF Core, MySQL)
├── frontend/         → React + TypeScript + MUI + Vite + TailwindCSS + PostMan
└── README.md


### How to Run

**Backend**
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run

cd frontend
npm install
npm run dev
