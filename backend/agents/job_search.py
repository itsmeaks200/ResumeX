from .base import BaseAgent
from models.schemas import ParsedResume, JobPosting, JobSearchResult
from config import get_settings
import httpx
import numpy as np

class JobSearchAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self._embedder = None
    
    @property
    def model(self) -> str:
        return self.settings.extraction_model
    
    @property
    def temperature(self) -> float:
        return self.settings.parsing_temp
    
    @property
    def embedder(self):
        if self._embedder is None:
            # Lazy import to avoid loading at module import time
            from sentence_transformers import SentenceTransformer
            self._embedder = SentenceTransformer('all-MiniLM-L6-v2')
        return self._embedder
    
    async def execute(self, resume: ParsedResume, limit: int = 10) -> JobSearchResult:
        skills = self._extract_skills(resume)
        query = " ".join(skills[:5])  # Top 5 skills as query
        
        jobs = []
        
        # Search multiple APIs
        jobs.extend(await self._search_adzuna(query))
        jobs.extend(await self._search_jsearch(query))
        jobs.extend(await self._search_remotive(query))
        
        # Rank by similarity
        if jobs:
            jobs = self._rank_jobs(jobs, resume)
        
        return JobSearchResult(
            jobs=jobs[:limit],
            query_skills=skills[:5]
        )
    
    def _extract_skills(self, resume: ParsedResume) -> list[str]:
        skills = []
        skills.extend(resume.skills.languages)
        skills.extend(resume.skills.frameworks)
        skills.extend(resume.skills.tools)
        return skills
    
    async def _search_adzuna(self, query: str) -> list[JobPosting]:
        settings = get_settings()
        if not settings.adzuna_app_id or not settings.adzuna_api_key:
            return []
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://api.adzuna.com/v1/api/jobs/us/search/1",
                    params={
                        "app_id": settings.adzuna_app_id,
                        "app_key": settings.adzuna_api_key,
                        "what": query,
                        "results_per_page": 10
                    },
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return [
                        JobPosting(
                            title=job.get("title", ""),
                            company=job.get("company", {}).get("display_name", ""),
                            location=job.get("location", {}).get("display_name", ""),
                            url=job.get("redirect_url", ""),
                            salary=f"${job.get('salary_min', 'N/A')} - ${job.get('salary_max', 'N/A')}",
                            description=job.get("description", "")[:500],
                            source="Adzuna"
                        )
                        for job in data.get("results", [])
                    ]
        except Exception:
            pass
        return []
    
    async def _search_jsearch(self, query: str) -> list[JobPosting]:
        settings = get_settings()
        if not settings.jsearch_api_key:
            return []
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://jsearch.p.rapidapi.com/search",
                    params={"query": query, "num_pages": 1},
                    headers={
                        "X-RapidAPI-Key": settings.jsearch_api_key,
                        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
                    },
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return [
                        JobPosting(
                            title=job.get("job_title", ""),
                            company=job.get("employer_name", ""),
                            location=f"{job.get('job_city', '')}, {job.get('job_state', '')}",
                            url=job.get("job_apply_link", ""),
                            salary=job.get("job_salary", ""),
                            description=job.get("job_description", "")[:500],
                            source="JSearch"
                        )
                        for job in data.get("data", [])
                    ]
        except Exception:
            pass
        return []
    
    async def _search_remotive(self, query: str) -> list[JobPosting]:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://remotive.com/api/remote-jobs",
                    params={"search": query, "limit": 10},
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return [
                        JobPosting(
                            title=job.get("title", ""),
                            company=job.get("company_name", ""),
                            location="Remote",
                            url=job.get("url", ""),
                            salary=job.get("salary", ""),
                            description=job.get("description", "")[:500],
                            source="Remotive"
                        )
                        for job in data.get("jobs", [])[:10]
                    ]
        except Exception:
            pass
        return []
    
    def _rank_jobs(self, jobs: list[JobPosting], resume: ParsedResume) -> list[JobPosting]:
        resume_text = f"{' '.join(self._extract_skills(resume))} {resume.summary}"
        resume_embedding = self.embedder.encode([resume_text])[0]
        
        for job in jobs:
            job_text = f"{job.title} {job.description}"
            job_embedding = self.embedder.encode([job_text])[0]
            similarity = np.dot(resume_embedding, job_embedding) / (
                np.linalg.norm(resume_embedding) * np.linalg.norm(job_embedding)
            )
            job.match_score = float(similarity * 100)
        
        return sorted(jobs, key=lambda x: x.match_score, reverse=True)
