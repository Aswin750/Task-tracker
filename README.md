# Personal Task Tracker

A beginner-friendly full-stack task tracker built with React, FastAPI, SQLAlchemy, and PostgreSQL.

## Features
- Create, list, edit, complete/uncomplete, filter, and delete tasks
- Task title, optional description, priority, completion state, creation timestamp
- PostgreSQL persistence using SQLAlchemy
- Pydantic request/response validation
- Swagger API docs at `/docs`

## Requirements
- Python 3.10+
- Node.js 18+
- PostgreSQL installed and running

## 1. Create the PostgreSQL database

Open `psql` or pgAdmin and run:

```sql
CREATE DATABASE task_tracker;
```

## 2. Start the backend

Open a terminal in `backend/`.

Create and activate a virtual environment:

```bash
python -m venv .venv
```

Windows PowerShell:
```powershell
.venv\Scripts\Activate.ps1
```

macOS/Linux:
```bash
source .venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and update the PostgreSQL username/password if needed.

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

macOS/Linux:
```bash
cp .env.example .env
```

Start FastAPI:
```bash
uvicorn main:app --reload
```

Backend URLs:
- API: `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`

The app creates the `tasks` table automatically on startup for this beginner MVP.

## 3. Start the frontend

Open another terminal in `frontend/`:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/tasks` | Create task |
| GET | `/tasks` | List tasks; optional `status=pending` or `status=completed` |
| GET | `/tasks/{task_id}` | Get one task |
| PUT | `/tasks/{task_id}` | Update title, description, and priority |
| PATCH | `/tasks/{task_id}/complete` | Toggle completion |
| DELETE | `/tasks/{task_id}` | Delete task |

## Notes
- This project is intended for local development and a single user. It does not include authentication.
- Do not deploy it as a public multi-user service without adding authentication and authorization.
- `.env` is excluded from Git; never commit real database credentials.
- For a later improvement, use Alembic for database migrations instead of relying on `Base.metadata.create_all()`.
