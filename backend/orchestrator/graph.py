from typing import TypedDict, Annotated, Literal
from langgraph.graph import StateGraph, END
from models.schemas import ParsedResume, JDAnalysis, MatchResult, ImprovementSuggestions, JobSearchResult

class AgentState(TypedDict):
    resume_file: bytes | None
    resume_filename: str | None
    jd_text: str | None
    parsed_resume: ParsedResume | None
    jd_analysis: JDAnalysis | None
    match_result: MatchResult | None
    improvements: ImprovementSuggestions | None
    job_results: JobSearchResult | None
    error: str | None
    current_step: str

# Lazy initialization
_agents = None

def get_agents():
    global _agents
    if _agents is None:
        from agents import (
            ResumeParserAgent,
            JDAnalyzerAgent,
            MatchingAgent,
            ImprovementAgent,
            JobSearchAgent,
            UIFormatterAgent
        )
        _agents = {
            'resume_parser': ResumeParserAgent(),
            'jd_analyzer': JDAnalyzerAgent(),
            'matcher': MatchingAgent(),
            'improver': ImprovementAgent(),
            'job_searcher': JobSearchAgent(),
            'ui_formatter': UIFormatterAgent(),
        }
    return _agents

async def parse_resume_node(state: AgentState) -> AgentState:
    try:
        agents = get_agents()
        parsed = await agents['resume_parser'].execute(
            state["resume_file"],
            state["resume_filename"]
        )
        state["parsed_resume"] = parsed
        state["current_step"] = "resume_parsed"
    except Exception as e:
        state["error"] = f"Resume parsing failed: {str(e)}"
    return state

async def analyze_jd_node(state: AgentState) -> AgentState:
    try:
        agents = get_agents()
        analysis = await agents['jd_analyzer'].execute(state["jd_text"])
        state["jd_analysis"] = analysis
        state["current_step"] = "jd_analyzed"
    except Exception as e:
        state["error"] = f"JD analysis failed: {str(e)}"
    return state

async def match_node(state: AgentState) -> AgentState:
    try:
        agents = get_agents()
        match = await agents['matcher'].execute(
            state["parsed_resume"],
            state["jd_analysis"]
        )
        state["match_result"] = match
        state["current_step"] = "matched"
    except Exception as e:
        state["error"] = f"Matching failed: {str(e)}"
    return state

async def improve_node(state: AgentState) -> AgentState:
    try:
        agents = get_agents()
        improvements = await agents['improver'].execute(
            state["parsed_resume"],
            state["jd_analysis"],
            state["match_result"]
        )
        state["improvements"] = improvements
        state["current_step"] = "improved"
    except Exception as e:
        state["error"] = f"Improvement suggestions failed: {str(e)}"
    return state

async def search_jobs_node(state: AgentState) -> AgentState:
    try:
        agents = get_agents()
        jobs = await agents['job_searcher'].execute(state["parsed_resume"])
        state["job_results"] = jobs
        state["current_step"] = "jobs_found"
    except Exception as e:
        state["error"] = f"Job search failed: {str(e)}"
    return state

def should_continue(state: AgentState) -> Literal["continue", "end"]:
    if state.get("error"):
        return "end"
    return "continue"

def create_full_analysis_graph() -> StateGraph:
    """Graph for full resume analysis with JD matching."""
    workflow = StateGraph(AgentState)
    
    workflow.add_node("parse_resume", parse_resume_node)
    workflow.add_node("analyze_jd", analyze_jd_node)
    workflow.add_node("match", match_node)
    workflow.add_node("improve", improve_node)
    
    workflow.set_entry_point("parse_resume")
    workflow.add_edge("parse_resume", "analyze_jd")
    workflow.add_edge("analyze_jd", "match")
    workflow.add_edge("match", "improve")
    workflow.add_edge("improve", END)
    
    return workflow.compile()

def create_resume_only_graph() -> StateGraph:
    """Graph for resume parsing only."""
    workflow = StateGraph(AgentState)
    workflow.add_node("parse_resume", parse_resume_node)
    workflow.set_entry_point("parse_resume")
    workflow.add_edge("parse_resume", END)
    return workflow.compile()

def create_job_search_graph() -> StateGraph:
    """Graph for job search based on resume."""
    workflow = StateGraph(AgentState)
    workflow.add_node("parse_resume", parse_resume_node)
    workflow.add_node("search_jobs", search_jobs_node)
    workflow.set_entry_point("parse_resume")
    workflow.add_edge("parse_resume", "search_jobs")
    workflow.add_edge("search_jobs", END)
    return workflow.compile()

# Lazy-loaded graphs
_graphs = {}

def get_full_analysis_graph():
    if 'full_analysis' not in _graphs:
        _graphs['full_analysis'] = create_full_analysis_graph()
    return _graphs['full_analysis']

def get_resume_only_graph():
    if 'resume_only' not in _graphs:
        _graphs['resume_only'] = create_resume_only_graph()
    return _graphs['resume_only']

def get_job_search_graph():
    if 'job_search' not in _graphs:
        _graphs['job_search'] = create_job_search_graph()
    return _graphs['job_search']
