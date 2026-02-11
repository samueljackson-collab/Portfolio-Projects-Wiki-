"""
Draft Generator - Free/Cheap AI Agent
======================================
Uses free-tier AI APIs to generate initial wiki entry drafts.

Supported providers:
- Google Gemini (free tier: 15 RPM, 1M TPM, 1500 RPD)
- Groq (free tier: 30 RPM, generous limits)
- Ollama (local, free, requires local setup)

The draft agent does the heavy lifting of generating content.
The output is then sent to Claude Opus for review and polish.
"""

import json
import logging
import os
import re
import time
from typing import Optional

logger = logging.getLogger(__name__)


class DraftGenerator:
    """Generates wiki entry drafts using free/cheap AI providers."""

    def __init__(self, provider: str = "gemini", model: str = "gemini-2.0-flash",
                 fallback_provider: str = "groq",
                 fallback_model: str = "llama-3.3-70b-versatile",
                 temperature: float = 0.4, max_retries: int = 3,
                 retry_delay: int = 10):
        self.provider = provider
        self.model = model
        self.fallback_provider = fallback_provider
        self.fallback_model = fallback_model
        self.temperature = temperature
        self.max_retries = max_retries
        self.retry_delay = retry_delay

    def generate(self, system_prompt: str, user_prompt: str) -> dict:
        """Generate a draft using the primary provider, falling back if needed."""
        # Try primary provider
        result = self._call_provider(self.provider, self.model,
                                     system_prompt, user_prompt)
        if result is not None:
            return result

        # Fallback
        logger.warning(f"Primary provider {self.provider} failed. "
                       f"Falling back to {self.fallback_provider}")
        result = self._call_provider(self.fallback_provider, self.fallback_model,
                                     system_prompt, user_prompt)
        if result is not None:
            return result

        raise RuntimeError("All AI providers failed to generate a draft")

    def _call_provider(self, provider: str, model: str,
                       system_prompt: str, user_prompt: str) -> Optional[dict]:
        """Route to the correct provider implementation."""
        for attempt in range(self.max_retries):
            try:
                if provider == "gemini":
                    raw = self._call_gemini(model, system_prompt, user_prompt)
                elif provider == "groq":
                    raw = self._call_groq(model, system_prompt, user_prompt)
                elif provider == "ollama":
                    raw = self._call_ollama(model, system_prompt, user_prompt)
                else:
                    raise ValueError(f"Unknown provider: {provider}")

                return self._parse_json_response(raw)

            except RateLimitError:
                wait = self.retry_delay * (attempt + 1)
                logger.warning(f"Rate limited on {provider}. "
                               f"Waiting {wait}s (attempt {attempt + 1})")
                time.sleep(wait)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON from {provider}: {e}")
                if attempt < self.max_retries - 1:
                    continue
                return None
            except Exception as e:
                logger.error(f"Error calling {provider}: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(2 ** attempt)
                    continue
                return None
        return None

    def _call_gemini(self, model: str, system_prompt: str,
                     user_prompt: str) -> str:
        """Call Google Gemini API (free tier)."""
        import urllib.request

        api_key = os.environ.get("GEMINI_API_KEY", "")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")

        url = (f"https://generativelanguage.googleapis.com/v1beta/"
               f"models/{model}:generateContent")

        payload = {
            "system_instruction": {
                "parts": [{"text": system_prompt}]
            },
            "contents": [{
                "parts": [{"text": user_prompt}]
            }],
            "generationConfig": {
                "temperature": self.temperature,
                "maxOutputTokens": 8192,
                "responseMimeType": "application/json",
            }
        }

        data = json.dumps(payload).encode()
        req = urllib.request.Request(
            url, data=data,
            headers={"Content-Type": "application/json",
                     "x-goog-api-key": api_key},
            method="POST"
        )

        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                result = json.loads(resp.read().decode())
                return _extract_gemini_text(result)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                raise RateLimitError("Gemini rate limit exceeded") from e
            body = e.read().decode() if e.readable() else str(e)
            raise RuntimeError(f"Gemini API error {e.code}: {body}") from e

    def _call_groq(self, model: str, system_prompt: str,
                   user_prompt: str) -> str:
        """Call Groq API (free tier)."""
        import urllib.request

        api_key = os.environ.get("GROQ_API_KEY", "")
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable not set")

        url = "https://api.groq.com/openai/v1/chat/completions"
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": self.temperature,
            "max_tokens": 8192,
            "response_format": {"type": "json_object"},
        }

        data = json.dumps(payload).encode()
        req = urllib.request.Request(
            url, data=data,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
            },
            method="POST"
        )

        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                result = json.loads(resp.read().decode())
                return result["choices"][0]["message"]["content"]
        except urllib.error.HTTPError as e:
            if e.code == 429:
                raise RateLimitError("Groq rate limit exceeded")
            body = e.read().decode() if e.readable() else str(e)
            raise RuntimeError(f"Groq API error {e.code}: {body}")

    def _call_ollama(self, model: str, system_prompt: str,
                     user_prompt: str) -> str:
        """Call local Ollama instance."""
        import urllib.request

        url = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
        url = f"{url}/api/generate"

        payload = {
            "model": model,
            "system": system_prompt,
            "prompt": user_prompt,
            "stream": False,
            "format": "json",
            "options": {"temperature": self.temperature},
        }

        data = json.dumps(payload).encode()
        req = urllib.request.Request(
            url, data=data,
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        try:
            with urllib.request.urlopen(req, timeout=300) as resp:
                result = json.loads(resp.read().decode())
                return result.get("response", "")
        except urllib.error.HTTPError as e:
            if e.code == 429:
                raise RateLimitError("Ollama rate limit exceeded") from e
            body = e.read().decode() if e.readable() else str(e)
            raise RuntimeError(f"Ollama API error {e.code}: {body}") from e

    def _parse_json_response(self, raw: str) -> dict:
        """Extract and parse JSON from AI response, handling markdown fences."""
        raw = raw.strip()

        # Remove markdown code fences if present
        if raw.startswith("```"):
            # Remove opening fence (```json or ```)
            raw = re.sub(r'^```\w*\s*\n?', '', raw)
            # Remove closing fence
            raw = re.sub(r'\n?```\s*$', '', raw)

        return json.loads(raw)


def _extract_gemini_text(result: dict) -> str:
    """Safely extract text from a Gemini response payload."""
    path = 'result["candidates"][0]["content"]["parts"][0]["text"]'

    candidates = result.get("candidates")
    if not isinstance(candidates, list) or not candidates:
        raise RuntimeError(
            f"Gemini response missing non-empty candidates list at {path}. "
            f"Full response: {json.dumps(result, ensure_ascii=False)}"
        )

    first_candidate = candidates[0]
    if not isinstance(first_candidate, dict):
        raise RuntimeError(
            f"Gemini response candidate is not an object at {path}. "
            f"Full response: {json.dumps(result, ensure_ascii=False)}"
        )

    content = first_candidate.get("content")
    if not isinstance(content, dict):
        raise RuntimeError(
            f"Gemini response missing content object at {path}. "
            f"Full response: {json.dumps(result, ensure_ascii=False)}"
        )

    parts = content.get("parts")
    if not isinstance(parts, list) or not parts:
        raise RuntimeError(
            f"Gemini response missing non-empty parts list at {path}. "
            f"Full response: {json.dumps(result, ensure_ascii=False)}"
        )

    first_part = parts[0]
    if not isinstance(first_part, dict) or "text" not in first_part:
        raise RuntimeError(
            f"Gemini response missing text field at {path}. "
            f"Full response: {json.dumps(result, ensure_ascii=False)}"
        )

    return str(first_part["text"])


class RateLimitError(Exception):
    """Raised when an API rate limit is hit."""
    pass
