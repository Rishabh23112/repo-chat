from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from utils import clone_repository, generate_file_tree, get_repo_name
from rag import ingest_repo, ask_question

app = FastAPI(title="Repo Chat API")

import os

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RepoRequest(BaseModel):
    url: str
    gemini_api_key: str

class ProcessResponse(BaseModel):
    message: str
    file_tree: List[Dict[str, Any]]
    repo_name: str

class ChatRequest(BaseModel):
    repo_name: str
    question: str
    chat_history: List[List[str]] # List of [question, answer]
    gemini_api_key: str

class ChatResponse(BaseModel):
    answer: str

@app.get("/")
async def root():
    return {"message": "Repo Chat API is running"}

@app.get("/file-content")
async def get_file_content(repo_name: str, file_path: str):
    """Get the content of a specific file from the cloned repository"""
    try:
        from utils import REPO_STORAGE_PATH
        import os
        
        # Construct the full path
        repo_path = os.path.join(REPO_STORAGE_PATH, repo_name)
        full_file_path = os.path.join(repo_path, file_path)
        
        # Security: ensure the path doesn't escape the repo directory
        if not os.path.abspath(full_file_path).startswith(os.path.abspath(repo_path)):
            raise HTTPException(status_code=403, detail="Access denied")
        
        if not os.path.exists(full_file_path):
            raise HTTPException(status_code=404, detail="File not found")
        
        if not os.path.isfile(full_file_path):
            raise HTTPException(status_code=400, detail="Path is not a file")
        
        # Read file content
        try:
            with open(full_file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            # Binary file
            raise HTTPException(status_code=400, detail="Cannot display binary file")
        
        return {
            "content": content,
            "path": file_path,
            "name": os.path.basename(file_path)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")

@app.post("/process-repo", response_model=ProcessResponse)
async def process_repo(request: RepoRequest):
    try:
        repo_path = clone_repository(request.url)
        repo_name = get_repo_name(request.url)
        
        # Ingest into Vector DB
        success, message = ingest_repo(repo_path, repo_name, request.gemini_api_key)
        if not success:
             raise HTTPException(status_code=400, detail=message)

        file_tree = generate_file_tree(repo_path)
        
        return {
            "message": f"Repository processed and ingested successfully. {message}",
            "file_tree": file_tree,
            "repo_name": repo_name
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Convert chat_history to list of tuples
        history_tuples = [(h[0], h[1]) for h in request.chat_history]
        
        answer = ask_question(request.repo_name, request.question, history_tuples, request.gemini_api_key)
        return {"answer": answer}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
