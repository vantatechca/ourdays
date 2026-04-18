"""RSS/News feed scraper using feedparser."""

import logging
from datetime import datetime, timezone
from config import RSS_FEEDS
from scrapers.base import BaseScraper, Signal

logger = logging.getLogger(__name__)


class RssScraper(BaseScraper):
    def __init__(self):
        super().__init__(name="RSS/News", platform="rss", min_delay=1.0, max_delay=3.0)

    async def scrape(self) -> list[Signal]:
        import feedparser

        signals = []

        for feed_config in RSS_FEEDS:
            try:
                feed = feedparser.parse(feed_config["url"])

                for entry in feed.entries[:20]:
                    title = entry.get("title", "")
                    summary = entry.get("summary", entry.get("description", ""))
                    link = entry.get("link", "")
                    published = entry.get("published", "")

                    # Quick relevance check
                    combined = f"{title} {summary}".lower()
                    peptide_keywords = [
                        "peptide", "semaglutide", "tirzepatide", "bpc-157",
                        "retatrutide", "glp-1", "biohack", "peptide therapy",
                    ]

                    if not any(kw in combined for kw in peptide_keywords):
                        continue

                    # Check for high-priority triggers
                    is_fda = "fda" in combined or "regulation" in combined
                    is_research = "study" in combined or "trial" in combined or "pubmed" in combined

                    relevance = 0.4
                    if is_fda:
                        relevance = 0.9  # FDA news is always high priority
                    elif is_research:
                        relevance = 0.6

                    signals.append(Signal(
                        signal_type="rss_article",
                        source_url=link,
                        title=title,
                        raw_content=summary[:2000],
                        metadata={
                            "feed_name": feed_config["name"],
                            "published": published,
                            "is_fda_related": is_fda,
                            "is_research": is_research,
                        },
                        relevance_score=relevance,
                    ))

                self.delay()

            except Exception as e:
                logger.warning(f"Error parsing feed {feed_config['name']}: {e}")
                continue

        return signals
