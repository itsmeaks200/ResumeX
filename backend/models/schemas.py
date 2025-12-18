from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

class Severity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Skills(BaseModel):
    languages: list[str] = []
    frameworks: list[str] = []
    tools: list[str] = []
    soft_skills: list[str] = []

class Education(BaseModel):
    institution: str
    degree: str
    field: str = ""
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    gpa: Optional[str] = None

class Experience(BaseModel):
    company: str
    title: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    location: Optional[str] = None
    bullets: list[str] = []

class Project(BaseModel):
    name: str
    description: str = ""
    technologies: list[str] = []
    url: Optional[str] = None

class ParsedResume(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    linkedin: str = ""
    location: str = ""
    summary: str = ""
    education: list[Education] = []
    experience: list[Experience] = []
    projects: list[Project] = []
    skills: Skills = Field(default_factory=Skills)
    certifications: list[str] = []

class JDAnalysis(BaseModel):
    title: str = ""
    company: str = ""
    required_skills: list[str] = []
    preferred_skills: list[str] = []
    experience_years: str = ""
    seniority: str = ""
    ats_keywords: list[str] = []
    responsibilities: list[str] = []
    benefits: list[str] = []

class MatchResult(BaseModel):
    ats_score: int = Field(ge=0, le=100)
    skill_overlap_percent: float
    matched_skills: list[str] = []
    missing_skills: list[str] = []
    keyword_coverage: float
    experience_match: str = ""
    strengths: list[str] = []
    gaps: list[str] = []

class Improvement(BaseModel):
    section: str
    original: str
    suggested: str
    reason: str
    severity: Severity
    keywords_added: list[str] = []

class ImprovementSuggestions(BaseModel):
    improvements: list[Improvement] = []
    missing_keywords: list[str] = []
    quantification_tips: list[str] = []
    section_order: list[str] = []
    overall_tips: list[str] = []

class JobPosting(BaseModel):
    title: str
    company: str
    location: str
    url: str
    salary: str = ""
    description: str = ""
    match_score: float = 0.0
    source: str = ""

class JobSearchResult(BaseModel):
    jobs: list[JobPosting] = []
    query_skills: list[str] = []

class UIResponse(BaseModel):
    success: bool
    data: dict
    tooltips: dict[str, str] = {}
    severity_map: dict[str, Severity] = {}
