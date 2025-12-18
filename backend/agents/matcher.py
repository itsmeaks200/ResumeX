from .base import BaseAgent
from .prompts import MATCHING_PROMPT
from models.schemas import ParsedResume, JDAnalysis, MatchResult
import json

class MatchingAgent(BaseAgent):
    @property
    def model(self) -> str:
        return self.settings.reasoning_model
    
    @property
    def temperature(self) -> float:
        return self.settings.matching_temp
    
    async def execute(self, resume: ParsedResume, jd: JDAnalysis) -> MatchResult:
        prompt = MATCHING_PROMPT.format(
            resume_json=json.dumps(resume.model_dump(), indent=2),
            jd_json=json.dumps(jd.model_dump(), indent=2)
        )
        
        response = self._call_llm(
            prompt,
            system_prompt="You are an ATS scoring expert. Be precise and return only valid JSON."
        )
        
        data = self._parse_json(response)
        return MatchResult(**data)
