"""
Multi-tier LLM router for PeptideIQ.
Tier 1: Cheap models (DeepSeek/Qwen) for bulk processing
Tier 2: Claude Haiku for scoring & compliance
Tier 3: Claude Sonnet for brain conversations & deep analysis
"""

import logging
from config import settings

logger = logging.getLogger(__name__)


class LLMRouter:
    """Routes LLM requests to the appropriate model tier with fallback chains."""

    FALLBACK_CHAINS = {
        "tier1": ["qwen-2.5-72b", "deepseek-v3", "kimi-k2.5", "llama-3"],
        "tier2": ["claude-haiku", "qwen-2.5-72b", "kimi-k2.5"],
        "tier3": ["claude-sonnet", "claude-haiku", "qwen-2.5-72b"],
    }

    async def complete(self, prompt: str, tier: str = "tier1", system: str | None = None) -> str:
        """Send a completion request to the appropriate model tier."""
        chain = self.FALLBACK_CHAINS.get(tier, self.FALLBACK_CHAINS["tier1"])

        for model in chain:
            try:
                result = await self._call_model(model, prompt, system)
                return result
            except Exception as e:
                logger.warning(f"Model {model} failed: {e}. Trying next in chain...")
                continue

        raise RuntimeError(f"All models in {tier} chain failed")

    async def _call_model(self, model: str, prompt: str, system: str | None = None) -> str:
        """Call a specific model. Routes to the appropriate API."""
        if model.startswith("claude"):
            return await self._call_anthropic(model, prompt, system)
        else:
            return await self._call_openrouter(model, prompt, system)

    async def _call_anthropic(self, model: str, prompt: str, system: str | None = None) -> str:
        """Call Claude via Anthropic API."""
        if not settings.anthropic_api_key:
            raise ValueError("Anthropic API key not configured")

        import anthropic

        model_id = {
            "claude-sonnet": "claude-sonnet-4-6",
            "claude-haiku": "claude-haiku-4-5-20251001",
        }.get(model, "claude-haiku-4-5-20251001")

        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        kwargs: dict = {
            "model": model_id,
            "max_tokens": 4096,
            "messages": [{"role": "user", "content": prompt}],
        }
        if system:
            kwargs["system"] = system

        message = client.messages.create(**kwargs)
        return message.content[0].text

    async def _call_openrouter(self, model: str, prompt: str, system: str | None = None) -> str:
        """Call open-source models via OpenRouter."""
        if not settings.openrouter_api_key:
            raise ValueError("OpenRouter API key not configured")

        import httpx

        model_map = {
            "qwen-2.5-72b": "qwen/qwen-2.5-72b-instruct",
            "deepseek-v3": "deepseek/deepseek-chat",
            "kimi-k2.5": "moonshot/kimi-k2.5",
            "llama-3": "meta-llama/llama-3-70b-instruct",
        }

        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.openrouter_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model_map.get(model, model),
                    "messages": messages,
                    "max_tokens": 4096,
                },
                timeout=60,
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]


# Singleton
llm = LLMRouter()
