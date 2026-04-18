"""Base scraper class with shared functionality."""

import time
import random
import logging
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import Any

logger = logging.getLogger(__name__)


class Signal:
    """A raw signal from a scraper — evidence of a potential product opportunity."""

    def __init__(
        self,
        signal_type: str,
        source_url: str,
        title: str | None = None,
        raw_content: str | None = None,
        content_summary: str | None = None,
        metadata: dict | None = None,
        relevance_score: float = 0.0,
    ):
        self.signal_type = signal_type
        self.source_url = source_url
        self.title = title
        self.raw_content = raw_content
        self.content_summary = content_summary
        self.metadata = metadata or {}
        self.relevance_score = relevance_score
        self.scraped_at = datetime.now(timezone.utc)

    def to_dict(self) -> dict:
        return {
            "signal_type": self.signal_type,
            "source_url": self.source_url,
            "title": self.title,
            "raw_content": self.raw_content,
            "content_summary": self.content_summary,
            "metadata": self.metadata,
            "relevance_score": self.relevance_score,
            "scraped_at": self.scraped_at.isoformat(),
        }


class BaseScraper(ABC):
    """Base class for all scrapers with rate limiting, retry, and status tracking."""

    def __init__(self, name: str, platform: str, min_delay: float = 3.0, max_delay: float = 8.0):
        self.name = name
        self.platform = platform
        self.min_delay = min_delay
        self.max_delay = max_delay
        self.status = "idle"
        self.last_run: datetime | None = None
        self.last_error: str | None = None
        self.error_count = 0
        self.total_signals = 0
        self.signals_buffer: list[Signal] = []

    def get_status(self) -> dict:
        return {
            "name": self.name,
            "platform": self.platform,
            "status": self.status,
            "last_run": self.last_run.isoformat() if self.last_run else None,
            "last_error": self.last_error,
            "error_count": self.error_count,
            "total_signals": self.total_signals,
        }

    def delay(self):
        """Random delay between requests to avoid rate limiting."""
        wait = random.uniform(self.min_delay, self.max_delay)
        time.sleep(wait)

    async def run(self):
        """Execute the scraper with error handling and status tracking."""
        self.status = "running"
        self.signals_buffer = []
        logger.info(f"[{self.name}] Starting scrape...")

        try:
            signals = await self.scrape()
            self.signals_buffer = signals
            self.total_signals += len(signals)
            self.status = "idle"
            self.last_run = datetime.now(timezone.utc)
            self.error_count = 0
            self.last_error = None
            logger.info(f"[{self.name}] Completed. Found {len(signals)} signals.")
            return signals
        except Exception as e:
            self.status = "error"
            self.error_count += 1
            self.last_error = str(e)
            logger.error(f"[{self.name}] Error: {e}")

            if self.error_count >= 5:
                self.status = "disabled"
                logger.warning(f"[{self.name}] Disabled after {self.error_count} consecutive failures.")

            return []

    @abstractmethod
    async def scrape(self) -> list[Signal]:
        """Implement the actual scraping logic. Returns list of Signal objects."""
        ...
