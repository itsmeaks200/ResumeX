from .base import BaseAgent
from models.schemas import UIResponse, Severity
import json

class UIFormatterAgent(BaseAgent):
    @property
    def model(self) -> str:
        return self.settings.extraction_model
    
    @property
    def temperature(self) -> float:
        return self.settings.parsing_temp
    
    async def execute(self, data: dict, data_type: str) -> UIResponse:
        tooltips = self._get_tooltips(data_type)
        severity_map = self._calculate_severity(data, data_type)
        
        return UIResponse(
            success=True,
            data=data,
            tooltips=tooltips,
            severity_map=severity_map
        )
    
    def _get_tooltips(self, data_type: str) -> dict[str, str]:
        base_tooltips = {
            "ats_score": "ATS (Applicant Tracking System) score estimates how well your resume will perform in automated screening. 70+ is good, 85+ is excellent.",
            "skill_overlap_percent": "Percentage of required skills from the job description that appear in your resume.",
            "keyword_coverage": "How many ATS keywords from the job posting are present in your resume.",
            "missing_skills": "Skills mentioned in the job description that are not found in your resume.",
            "matched_skills": "Skills from your resume that match the job requirements.",
            "experience_match": "How well your experience level matches the job requirements.",
            "match_score": "Similarity score between your profile and the job posting based on skills and experience."
        }
        
        type_specific = {
            "match": {
                "strengths": "Areas where your resume strongly aligns with the job requirements.",
                "gaps": "Areas where your resume could be improved to better match the job."
            },
            "improvement": {
                "severity": "Impact level of the suggestion: high = critical for ATS, medium = recommended, low = nice to have.",
                "keywords_added": "ATS keywords that would be added by implementing this suggestion."
            },
            "jobs": {
                "source": "The job board or API where this posting was found.",
                "salary": "Salary information if provided by the employer."
            }
        }
        
        return {**base_tooltips, **type_specific.get(data_type, {})}
    
    def _calculate_severity(self, data: dict, data_type: str) -> dict[str, Severity]:
        severity_map = {}
        
        if data_type == "match":
            ats_score = data.get("ats_score", 0)
            if ats_score < 50:
                severity_map["ats_score"] = Severity.HIGH
            elif ats_score < 70:
                severity_map["ats_score"] = Severity.MEDIUM
            else:
                severity_map["ats_score"] = Severity.LOW
            
            missing = len(data.get("missing_skills", []))
            if missing > 5:
                severity_map["missing_skills"] = Severity.HIGH
            elif missing > 2:
                severity_map["missing_skills"] = Severity.MEDIUM
            else:
                severity_map["missing_skills"] = Severity.LOW
        
        return severity_map
