from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import json
from datetime import datetime

app = FastAPI(
    title="Rafeeq Kernel API",
    description="Mobile Backend for Rafeeq Hybrid App",
    version="2.3.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Models =====
class Agent(BaseModel):
    id: str
    name: str
    role: str
    description: str
    status: str

class EvolutionTask(BaseModel):
    id: str
    type: str
    description: str
    status: str
    progress: int

class HealthStatus(BaseModel):
    status: str
    db: dict
    redis: dict
    cpu: float
    memory: float
    uptime: float

class ChatMessage(BaseModel):
    message: str

class ScriptRun(BaseModel):
    name: str

# ===== In-Memory Data =====
agents_db = [
    {"id": "wolf_alpha", "name": "WolfAlpha", "role": "System Architect", "description": "مهندس النظام الرئيسي", "status": "active"},
    {"id": "code_wolf", "name": "CodeWolf", "role": "Developer", "description": "مطور الأكواد", "status": "idle"},
    {"id": "design_wolf", "name": "DesignWolf", "role": "UI/UX Designer", "description": "مصمم الواجهات", "status": "idle"},
    {"id": "security_wolf", "name": "SecurityWolf", "role": "Security Expert", "description": "خبير الأمان", "status": "active"},
    {"id": "cloud_wolf", "name": "CloudWolf", "role": "DevOps Engineer", "description": "مهندس السحابة", "status": "idle"},
]

tasks_db = []
connections = set()

# ===== Routes =====
@app.get("/")
async def root():
    return {"message": "Rafeeq Kernel v2.3.0", "status": "online"}

@app.get("/api/health", response_model=HealthStatus)
async def health():
    return HealthStatus(
        status="healthy",
        db={"connected": True, "latency": 8},
        redis={"connected": True, "latency": 3},
        cpu=45.2,
        memory=62.1,
        uptime=86400 * 3 + 3600 * 5
    )

@app.get("/api/agents", response_model=List[Agent])
async def get_agents():
    return agents_db

@app.post("/api/agents/{agent_id}/chat")
async def chat_with_agent(agent_id: str, msg: ChatMessage):
    responses = [
        "أفهم طلبك. سأقوم بتحليله وإعطائك أفضل الحلول.",
        "جاري معالجة البيانات... يمكنني مساعدتك في ذلك.",
        "تمام! سأنشئ لك كود مخصص لهذه المهمة.",
        "ممتاز، سأقوم بتفعيل الوكلاء المناسبين."
    ]
    return {"agent_id": agent_id, "response": responses[hash(msg.message) % len(responses)]}

@app.post("/api/evolution/trigger")
async def trigger_evolution():
    task = {"id": str(len(tasks_db) + 1), "type": "code", "description": "دورة تطور ذاتية تلقائية", "status": "running", "progress": 0}
    tasks_db.append(task)
    return {"status": "triggered", "task": task}

@app.get("/api/evolution/tasks", response_model=List[EvolutionTask])
async def get_evolution_tasks():
    return tasks_db

@app.get("/api/github/repos")
async def get_repos():
    return [
        {"name": "dtr-hjin", "description": "Rafeeq Kernel Hybrid Mobile", "stars": 12, "forks": 3, "language": "Python"},
        {"name": "dtr-n", "description": "Self-Evolving AI System", "stars": 45, "forks": 8, "language": "Python"},
        {"name": "dtr2", "description": "DTR Server Generator", "stars": 23, "forks": 5, "language": "TypeScript"},
        {"name": "wolf-ai", "description": "Wolf AI Platform", "stars": 67, "forks": 12, "language": "Next.js"}
    ]

@app.get("/api/db/tables")
async def get_tables():
    return [
        {"name": "users", "rows": 1247, "size": "2.4 MB", "lastUpdated": "5 mins ago"},
        {"name": "sessions", "rows": 3892, "size": "1.8 MB", "lastUpdated": "1 min ago"},
        {"name": "agents", "rows": 10, "size": "12 KB", "lastUpdated": "1 day ago"},
        {"name": "evolution_logs", "rows": 15678, "size": "8.5 MB", "lastUpdated": "10 mins ago"}
    ]

@app.post("/api/db/query")
async def run_query(query: dict):
    return {"result": "Query executed successfully", "rows": 42}

@app.post("/api/scripts/run/{name}")
async def run_script(name: str):
    return {"status": "success", "script": name, "output": f"Script {name} executed successfully"}

@app.get("/api/health/metrics")
async def get_metrics():
    return {
        "cpu": [30, 45, 35, 60, 55, 76],
        "memory": [50, 55, 60, 58, 62, 65],
        "requests": [120, 150, 180, 200, 170, 190]
    }

# ===== WebSocket =====
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connections.add(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            await websocket.send_json({
                "type": "response",
                "message": f"Received: {msg.get('message', '')}",
                "timestamp": datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        connections.discard(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
