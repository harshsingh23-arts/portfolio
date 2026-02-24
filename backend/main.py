from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import sqlite3
import os
from datetime import datetime
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Portfolio AI Chat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_db():
    conn = sqlite3.connect("chat_history.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

init_db()

RESUME_CONTEXT = """You are Harsh Singh's AI portfolio assistant. Be helpful, professional, and enthusiastic.
Answer questions based on this resume:

NAME: Harsh Singh
TITLE: B.Tech IT Student and Aspiring Software Developer
LOCATION: Vellore, Tamil Nadu
EMAIL: h55152810@gmail.com
PHONE: +91 79037 77659

SUMMARY:
Motivated 3rd-year B.Tech Information Technology student at VIT Vellore with a strong foundation in
software development and Data Structures and Algorithms. Passionate about solving real-world problems
through technology, with hands-on experience in Full Stack Web Development, Mobile App Development,
and Machine Learning. Seeking an internship to leverage skills in Java, Python, and App Development.

EDUCATION:
- Vellore Institute of Technology (VIT)
  Bachelor of Technology in Information Technology
  Vellore, Tamil Nadu
  2023 - 2027 (Expected)
  Currently in 3rd Year

TECHNICAL SKILLS:
- Programming Languages: Java, C, C++, Python, Kotlin
- Core Competencies: Data Structures and Algorithms (DSA), Object-Oriented Programming (OOP),
  Web Development, Mobile App Development
- Tools and Technologies: Android Studio, Git, VS Code, Machine Learning Libraries

PROJECTS:

1. Surface Defect Detection Application (Python, Machine Learning)
   - Developed a Machine Learning application to automatically detect and classify surface defects
     on manufacturing materials
   - Implemented image processing algorithms to analyze surface textures and identify anomalies
     with high accuracy
   - Reduced potential manual inspection time by automating the visual quality control process

2. Prescription Checker Mobile App (Android, Kotlin, XML)
   - Engineered a mobile application to assist users in verifying and organizing medical prescriptions
   - Designed a user-friendly interface using Kotlin and XML to ensure accessibility for varied age groups
   - Integrated logic to validate prescription data, ensuring accuracy and safety in medication management

3. Real-Time Chat Application (Web Technologies)
   - Built a fully functional chat application enabling real-time messaging between users
   - Implemented backend logic to handle concurrent user sessions and ensure message delivery reliability
   - Focused on optimizing latency and providing a responsive user interface for seamless communication

Keep answers concise, friendly, and professional. For internship or hiring inquiries, direct to email h55152810@gmail.com."""


class ChatRequest(BaseModel):
    message: str
    session_id: str
    openrouter_key: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    session_id: str


def get_session_history(session_id: str, limit: int = 10):
    conn = sqlite3.connect("chat_history.db")
    cursor = conn.cursor()
    cursor.execute(
        "SELECT role, content FROM chat_sessions WHERE session_id = ? ORDER BY timestamp DESC LIMIT ?",
        (session_id, limit)
    )
    rows = cursor.fetchall()
    conn.close()
    return [{"role": row[0], "content": row[1]} for row in reversed(rows)]


def save_message(session_id: str, role: str, content: str):
    conn = sqlite3.connect("chat_history.db")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO chat_sessions (session_id, role, content) VALUES (?, ?, ?)",
        (session_id, role, content)
    )
    conn.commit()
    conn.close()


def extract_text(data: dict) -> str:
    try:
        choices = data.get("choices", [])
        if not choices:
            return ""
        message = choices[0].get("message", {})
        content = message.get("content", "")
        if isinstance(content, str) and content.strip():
            return content.strip()
        if isinstance(content, list):
            parts = [p.get("text", "") for p in content if isinstance(p, dict)]
            joined = " ".join(parts).strip()
            if joined:
                return joined
        reasoning = message.get("reasoning", "")
        if reasoning and isinstance(reasoning, str) and reasoning.strip():
            return reasoning.strip()
        return ""
    except Exception as e:
        print("Extract error:", e)
        return ""


async def get_free_models(client: httpx.AsyncClient, api_key: str) -> list:
    try:
        resp = await client.get(
            "https://openrouter.ai/api/v1/models",
            headers={"Authorization": "Bearer " + api_key}
        )
        if resp.status_code != 200:
            return []
        data = resp.json()
        free_models = []
        for model in data.get("data", []):
            model_id = model.get("id", "")
            pricing = model.get("pricing", {})
            prompt_price = float(pricing.get("prompt", "1") or "1")
            completion_price = float(pricing.get("completion", "1") or "1")
            if prompt_price == 0 and completion_price == 0:
                free_models.append(model_id)
        print("Found", len(free_models), "free models")
        return free_models
    except Exception as e:
        print("Error fetching models:", e)
        return []


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    api_key = request.openrouter_key or os.getenv("OPENROUTER_API_KEY", "") or "sk-or-your-new-key-here"

    if not api_key:
        raise HTTPException(status_code=400, detail="OpenRouter API key required.")

    history = get_session_history(request.session_id)
    messages = [{"role": "system", "content": RESUME_CONTEXT}]
    messages.extend(history)
    messages.append({"role": "user", "content": request.message})
    save_message(request.session_id, "user", request.message)

    last_error = "No free models found"

    async with httpx.AsyncClient(timeout=30) as client:
        free_models = await get_free_models(client, api_key)

        if not free_models:
            raise HTTPException(status_code=502, detail="Could not fetch model list from OpenRouter.")

        for model in free_models:
            try:
                print("Trying:", model)
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": "Bearer " + api_key,
                        "HTTP-Referer": "https://harshsingh.dev",
                        "X-Title": "Harsh Singh Portfolio",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": model,
                        "messages": messages,
                        "max_tokens": 512,
                        "temperature": 0.7
                    }
                )

                if response.status_code != 200:
                    last_error = response.text
                    continue

                data = response.json()
                ai_response = extract_text(data)

                if not ai_response:
                    last_error = "Empty response from " + model
                    continue

                save_message(request.session_id, "assistant", ai_response)
                print("Success with:", model)
                return ChatResponse(response=ai_response, session_id=request.session_id)

            except Exception as e:
                last_error = str(e)
                continue

    raise HTTPException(status_code=502, detail="All models failed. Last error: " + last_error)


@app.get("/api/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}


@app.delete("/api/chat/{session_id}")
async def clear_chat(session_id: str):
    conn = sqlite3.connect("chat_history.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM chat_sessions WHERE session_id = ?", (session_id,))
    conn.commit()
    conn.close()
    return {"message": "Chat history cleared"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)