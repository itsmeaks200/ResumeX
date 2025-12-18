from .base import BaseAgent
from .prompts import JD_ANALYZER_PROMPT
from models.schemas import JDAnalysis

class JDAnalyzerAgent(BaseAgent):
    @property
    def model(self) -> str:
        return self.settings.extraction_model
    
    @property
    def temperature(self) -> float:
        return self.settings.parsing_temp
    
    async def execute(self, jd_text: str) -> JDAnalysis:
        prompt = JD_ANALYZER_PROMPT.format(jd_text=jd_text)
        
        response = self._call_llm(
            prompt,
            system_prompt="You are a job description analyzer. Return only valid JSON."
        )
        
        data = self._parse_json(response)
        return JDAnalysis(**data)
