from abc import ABC, abstractmethod
from groq import Groq
from config import get_settings
import json
import re

class BaseAgent(ABC):
    def __init__(self):
        self.settings = get_settings()
        self._client = None
    
    @property
    def client(self):
        if self._client is None:
            self._client = Groq(api_key=self.settings.groq_api_key)
        return self._client
    
    @property
    @abstractmethod
    def model(self) -> str:
        pass
    
    @property
    @abstractmethod
    def temperature(self) -> float:
        pass
    
    @abstractmethod
    async def execute(self, **kwargs) -> dict:
        pass
    
    def _call_llm(self, prompt: str, system_prompt: str = "") -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=self.temperature,
            max_tokens=4096
        )
        return response.choices[0].message.content
    
    def _parse_json(self, text: str) -> dict:
        """Extract JSON from LLM response."""
        text = text.strip()
        json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
        if json_match:
            text = json_match.group(1)
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            start = text.find('{')
            end = text.rfind('}') + 1
            if start != -1 and end > start:
                return json.loads(text[start:end])
            raise ValueError("Could not parse JSON from response")
