from sqlalchemy import select
from sqlalchemy.orm import Session

from models import Task
from schemas import TaskCreate, TaskUpdate


def create_task(db: Session, task_data: TaskCreate) -> Task:
    task = Task(**task_data.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get_tasks(db: Session, status: str | None = None) -> list[Task]:
    statement = select(Task).order_by(Task.created_at.desc(), Task.id.desc())

    if status == "pending":
        statement = statement.where(Task.is_completed.is_(False))
    elif status == "completed":
        statement = statement.where(Task.is_completed.is_(True))

    return list(db.scalars(statement).all())


def get_task(db: Session, task_id: int) -> Task | None:
    return db.get(Task, task_id)


def update_task(db: Session, task: Task, task_data: TaskUpdate) -> Task:
    for field, value in task_data.model_dump().items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


def set_task_completion(db: Session, task: Task, is_completed: bool) -> Task:
    task.is_completed = is_completed
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()
