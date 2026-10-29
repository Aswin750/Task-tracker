from contextlib import asynccontextmanager
from typing import Annotated, Literal

from fastapi import Depends, FastAPI, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import crud
import models  # noqa: F401 - ensures SQLAlchemy model is registered
from database import Base, engine, get_db
from schemas import TaskCompletionUpdate, TaskCreate, TaskResponse, TaskUpdate


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Convenient for a learning MVP. Use Alembic migrations for a production app.
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Personal Task Tracker API",
    description="A simple REST API for managing personal tasks.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DbSession = Annotated[Session, Depends(get_db)]


@app.get("/")
def root():
    return {"message": "Personal Task Tracker API is running."}


@app.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task_data: TaskCreate, db: DbSession):
    return crud.create_task(db, task_data)


@app.get("/tasks", response_model=list[TaskResponse])
def list_tasks(
    db: DbSession,
    task_status: Annotated[
        Literal["pending", "completed"] | None,
        Query(alias="status"),
    ] = None,
):
    return crud.get_tasks(db, task_status)


@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: DbSession):
    task = crud.get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found.")
    return task


@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_data: TaskUpdate, db: DbSession):
    task = crud.get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found.")
    return crud.update_task(db, task, task_data)


@app.patch("/tasks/{task_id}/complete", response_model=TaskResponse)
def update_completion(
    task_id: int,
    completion_data: TaskCompletionUpdate,
    db: DbSession,
):
    task = crud.get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found.")
    return crud.set_task_completion(db, task, completion_data.is_completed)


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: DbSession):
    task = crud.get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found.")
    crud.delete_task(db, task)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
