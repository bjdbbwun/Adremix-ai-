import json
import time
import google.generativeai as genai
from typing import Optional, Dict, Any
from config import config

class GeminiClient:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            genai.configure(api_key=config.GEMINI_API_KEY)
            cls._instance.model = genai.GenerativeModel(config.MODEL_NAME)
        return cls._instance

    def generate(
        self,
        prompt: str,
        response_schema: Optional[Dict[str, Any]] = None,
        temperature: float = 0.9,
    ) -> dict:
        generation_config = {
            "temperature": temperature,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": config.MAX_OUTPUT_TOKENS,
            "response_mime_type": "application/json",
        }

        if response_schema:
            generation_config["response_schema"] = response_schema

        max_attempts = 4
        base_delay = 5
        for attempt in range(max_attempts):
            try:
                response = self.model.generate_content(
                    prompt,
                    generation_config=genai.GenerationConfig(**generation_config),
                )
                return self._parse_response(response.text)
            except Exception as e:
                is_rate_limit = any(term in str(e).lower() for term in ["429", "quota", "exhausted", "resource_exhausted", "rate_limit"])
                if is_rate_limit and attempt < max_attempts - 1:
                    sleep_time = base_delay * (2 ** attempt)
                    print(f"Rate limit hit in generate. Retrying in {sleep_time} seconds (attempt {attempt + 1}/{max_attempts})...")
                    time.sleep(sleep_time)
                else:
                    raise RuntimeError(f"فشل الاتصال بـ Gemini: {str(e)}")

    def _parse_response(self, text: str) -> dict:
        cleaned = text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        return json.loads(cleaned.strip())

    def generate_structured(self, prompt: str, schema_class, system_instruction: str = None, temperature: float = None) -> any:
        """
        Sends a query to Gemini with a forced structured response schema.
        Returns an instance of schema_class populated with Gemini's response.
        For compatibility with the Adremix-engine callers.
        """
        generation_config = {
            "temperature": temperature if temperature is not None else 0.2,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": config.MAX_OUTPUT_TOKENS,
            "response_mime_type": "application/json",
            "response_schema": schema_class,
        }

        max_attempts = 4
        base_delay = 5
        for attempt in range(max_attempts):
            try:
                # Under google.generativeai, system_instruction is set on the model.
                # We can create a temporary model with system_instruction.
                if system_instruction:
                    temp_model = genai.GenerativeModel(
                        config.MODEL_NAME,
                        system_instruction=system_instruction
                    )
                else:
                    temp_model = self.model

                response = temp_model.generate_content(
                    prompt,
                    generation_config=genai.GenerationConfig(**generation_config),
                )
                
                response_text = response.text
                if not response_text:
                    raise ValueError("Received an empty response from Gemini.")
                    
                return schema_class.model_validate_json(response_text)
            except Exception as e:
                is_rate_limit = any(term in str(e).lower() for term in ["429", "quota", "exhausted", "resource_exhausted", "rate_limit"])
                if is_rate_limit and attempt < max_attempts - 1:
                    sleep_time = base_delay * (2 ** attempt)
                    print(f"Rate limit hit in generate_structured. Retrying in {sleep_time} seconds (attempt {attempt + 1}/{max_attempts})...")
                    time.sleep(sleep_time)
                else:
                    raise RuntimeError(f"فشل الاتصال بـ Gemini (مع بنية البيانات): {str(e)}")

gemini = GeminiClient()
