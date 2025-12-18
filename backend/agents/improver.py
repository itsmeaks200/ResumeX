from .base import BaseAgent
from .prompts import IMPROVEMENT_PROMPT
from models.schemas import ParsedResume, JDAnalysis, MatchResult, ImprovementSuggestions
import json

class ImprovementAgent(BaseAgent):
    @property
    def model(self) -> str:
        return self.settings.reasoning_model
    
    @property
    def temperature(self) -> float:
        return self.settings.suggestion_temp
    
    async def execute(
        self, 
        resume: ParsedResume, 
        jd: JDAnalysis, 
        match: MatchResult
    ) -> ImprovementSuggestions:
        prompt = IMPROVEMENT_PROMPT.format(
            resume_json=json.dumps(resume.model_dump(), indent=2),
            jd_json=json.dumps(jd.model_dump(), indent=2),
            match_json=json.dumps(match.model_dump(), indent=2)
        )
        
        response = self._call_llm(
            prompt,
            system_prompt="You are a professional resume coach. Provide actionable improvements. Return only valid JSON."
        )
        
        data = self._parse_json(response)
        return ImprovementSuggestions(**data)
