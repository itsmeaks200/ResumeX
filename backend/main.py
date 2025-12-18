from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from orchestrator import get_full_analysis_graph, get_resume_only_graph, get_job_search_graph, AgentState
from agents import JDAnalyzerAgent, MatchingAgent, ImprovementAgent, UIFormatterAgent
from models.schemas import ParsedResume, JDAnalysis, MatchResult, ImprovementSuggestions, JobSearchResult
import json

app = FastAPI(
    title="ResumeX API",
    description="AI-powered resume analysis with multi-agent orchestration",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",  # Alternative port
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

class JDRequest(BaseModel):
    jd_text: str

class MatchRequest(BaseModel):
    resume: dict
    jd: dict

class ImproveRequest(BaseModel):
    resume: dict
    jd: dict
    match: dict

# Lazy initialization of agents
def get_jd_analyzer():
    if not hasattr(get_jd_analyzer, '_instance'):
        get_jd_analyzer._instance = JDAnalyzerAgent()
    return get_jd_analyzer._instance

def get_matcher():
    if not hasattr(get_matcher, '_instance'):
        get_matcher._instance = MatchingAgent()
    return get_matcher._instance

def get_improver():
    if not hasattr(get_improver, '_instance'):
        get_improver._instance = ImprovementAgent()
    return get_improver._instance

def get_ui_formatter():
    if not hasattr(get_ui_formatter, '_instance'):
        get_ui_formatter._instance = UIFormatterAgent()
    return get_ui_formatter._instance

@app.get("/")
async def root():
    return {"message": "ResumeX API", "status": "healthy"}

@app.post("/api/resume/parse")
async def parse_resume(file: UploadFile = File(...)):
    """Parse a resume file and extract structured data."""
    if not file.filename:
        raise HTTPException(400, "No file provided")
    
    ext = file.filename.lower().split('.')[-1]
    if ext not in ['pdf', 'docx', 'doc']:
        raise HTTPException(400, "Unsupported file type. Use PDF or DOCX.")
    
    content = await file.read()
    
    initial_state: AgentState = {
        "resume_file": content,
        "resume_filename": file.filename,
        "jd_text": None,
        "parsed_resume": None,
        "jd_analysis": None,
        "match_result": None,
        "improvements": None,
        "job_results": None,
        "error": None,
        "current_step": "started"
    }
    
    result = await get_resume_only_graph().ainvoke(initial_state)
    
    if result.get("error"):
        raise HTTPException(500, result["error"])
    
    parsed = result["parsed_resume"]
    formatted = await get_ui_formatter().execute(parsed.model_dump(), "resume")
    
    return formatted.model_dump()

@app.post("/api/jd/analyze")
async def analyze_jd(request: JDRequest):
    """Analyze a job description and extract requirements."""
    if not request.jd_text.strip():
        raise HTTPException(400, "Job description text is required")
    
    analysis = await get_jd_analyzer().execute(request.jd_text)
    formatted = await get_ui_formatter().execute(analysis.model_dump(), "jd")
    
    return formatted.model_dump()

@app.post("/api/match")
async def match_resume_jd(request: MatchRequest):
    """Match a parsed resume against a JD analysis."""
    resume = ParsedResume(**request.resume)
    jd = JDAnalysis(**request.jd)
    
    match_result = await get_matcher().execute(resume, jd)
    formatted = await get_ui_formatter().execute(match_result.model_dump(), "match")
    
    return formatted.model_dump()

@app.post("/api/improve")
async def get_improvements(request: ImproveRequest):
    """Get improvement suggestions for a resume based on JD."""
    resume = ParsedResume(**request.resume)
    jd = JDAnalysis(**request.jd)
    match = MatchResult(**request.match)
    
    improvements = await get_improver().execute(resume, jd, match)
    formatted = await get_ui_formatter().execute(improvements.model_dump(), "improvement")
    
    return formatted.model_dump()

@app.post("/api/analyze/full")
async def full_analysis(
    file: UploadFile = File(...),
    jd_text: str = Form(...)
):
    """Run full analysis pipeline: parse resume, analyze JD, match, and suggest improvements."""
    if not file.filename:
        raise HTTPException(400, "No file provided")
    
    content = await file.read()
    
    initial_state: AgentState = {
        "resume_file": content,
        "resume_filename": file.filename,
        "jd_text": jd_text,
        "parsed_resume": None,
        "jd_analysis": None,
        "match_result": None,
        "improvements": None,
        "job_results": None,
        "error": None,
        "current_step": "started"
    }
    
    result = await get_full_analysis_graph().ainvoke(initial_state)
    
    if result.get("error"):
        raise HTTPException(500, result["error"])
    
    return {
        "resume": result["parsed_resume"].model_dump() if result["parsed_resume"] else None,
        "jd_analysis": result["jd_analysis"].model_dump() if result["jd_analysis"] else None,
        "match": result["match_result"].model_dump() if result["match_result"] else None,
        "improvements": result["improvements"].model_dump() if result["improvements"] else None
    }

@app.post("/api/jobs/search")
async def search_jobs(file: UploadFile = File(...)):
    """Search for jobs matching the resume."""
    if not file.filename:
        raise HTTPException(400, "No file provided")
    
    content = await file.read()
    
    initial_state: AgentState = {
        "resume_file": content,
        "resume_filename": file.filename,
        "jd_text": None,
        "parsed_resume": None,
        "jd_analysis": None,
        "match_result": None,
        "improvements": None,
        "job_results": None,
        "error": None,
        "current_step": "started"
    }
    
    result = await get_job_search_graph().ainvoke(initial_state)
    
    if result.get("error"):
        raise HTTPException(500, result["error"])
    
    jobs = result["job_results"]
    formatted = await get_ui_formatter().execute(jobs.model_dump(), "jobs")
    
    return formatted.model_dump()

@app.post("/api/jobs/search-from-parsed")
async def search_jobs_from_parsed(resume: dict):
    """Search for jobs using already parsed resume data."""
    from agents import JobSearchAgent
    
    parsed = ParsedResume(**resume)
    searcher = JobSearchAgent()
    jobs = await searcher.execute(parsed)
    formatted = await get_ui_formatter().execute(jobs.model_dump(), "jobs")
    
    return formatted.model_dump()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
