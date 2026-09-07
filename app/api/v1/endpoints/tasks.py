"""Tasks API router."""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

class TaskItem(BaseModel):
    id: str
    text: str
    priority: str
    completed: bool = False
    block: Optional[str] = "Main Parcel"
    due_date: Optional[str] = "Today"

class TaskCreate(BaseModel):
    text: str
    priority: str = "High"
    block: Optional[str] = "Main Parcel"

class TaskUpdate(BaseModel):
    completed: Optional[bool] = None

in_memory_tasks = [
    {
        "id": "task-1",
        "text": "Apply 50kg Biochar + Compost to East Block",
        "priority": "High",
        "completed": False,
        "block": "East Block",
        "due_date": "Today",
    },
    {
        "id": "task-2",
        "text": "Inspect tomato crop for Early Blight symptoms",
        "priority": "Medium",
        "completed": True,
        "block": "Main Parcel",
        "due_date": "Yesterday",
    },
    {
        "id": "task-3",
        "text": "Sow legume cover crop (Cowpea / Sunn Hemp)",
        "priority": "Low",
        "completed": False,
        "block": "South Parcel",
        "due_date": "Tomorrow",
    },
]

@router.get("/", response_model=List[TaskItem])
async def list_tasks():
    return in_memory_tasks

@router.post("/", response_model=TaskItem)
async def create_task(payload: TaskCreate):
    new_id = f"task-{len(in_memory_tasks) + 1}"
    task = {
        "id": new_id,
        "text": payload.text,
        "priority": payload.priority,
        "completed": False,
        "block": payload.block or "Main Parcel",
        "due_date": "Today",
    }
    in_memory_tasks.insert(0, task)
    return task

@router.patch("/{task_id}", response_model=TaskItem)
async def update_task(task_id: str, payload: TaskUpdate):
    for task in in_memory_tasks:
        if task["id"] == task_id:
            if payload.completed is not None:
                task["completed"] = payload.completed
            return task
    return {
        "id": task_id,
        "text": "Task",
        "priority": "Medium",
        "completed": payload.completed or False,
        "block": "Main Parcel",
        "due_date": "Today",
    }

@router.delete("/{task_id}")
async def delete_task(task_id: str):
    global in_memory_tasks
    in_memory_tasks = [t for t in in_memory_tasks if t["id"] != task_id]
    return {"status": "deleted", "id": task_id}
