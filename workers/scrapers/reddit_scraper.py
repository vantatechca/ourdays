"""Reddit scraper using PRAW — highest signal source for PeptideIQ."""

import logging
from datetime import datetime, timezone
from config import settings, TARGET_SUBREDDITS
from scrapers.base import BaseScraper, Signal

logger = logging.getLogger(__name__)

# Phrases that indicate product opportunity demand
DEMAND_PHRASES = [
    "looking for", "wish there was", "anyone know a tool",
    "spreadsheet", "calculator", "guide", "course", "recommendation",
    "how to", "best way to", "help me understand", "confused about",
    "where can I find", "does anyone have", "is there a",
    "template", "tracker", "planner", "checklist",
]


class RedditScraper(BaseScraper):
    def __init__(self):
        super().__init__(name="Reddit", platform="reddit", min_delay=1.0, max_delay=2.0)
        self.client = None

    def _init_client(self):
        if self.client is not None:
            return

        if not settings.reddit_client_id or not settings.reddit_client_secret:
            raise ValueError("Reddit API credentials not configured")

        import praw
        self.client = praw.Reddit(
            client_id=settings.reddit_client_id,
            client_secret=settings.reddit_client_secret,
            user_agent=settings.reddit_user_agent,
        )

    async def scrape(self) -> list[Signal]:
        self._init_client()
        signals = []

        for subreddit_name in TARGET_SUBREDDITS:
            try:
                subreddit = self.client.subreddit(subreddit_name)

                # Scrape new posts (last 24 hours)
                for post in subreddit.new(limit=50):
                    signal = self._process_post(post, subreddit_name)
                    if signal:
                        signals.append(signal)
                    self.delay()

                # Scrape top posts this week
                for post in subreddit.top(time_filter="week", limit=25):
                    signal = self._process_post(post, subreddit_name)
                    if signal:
                        signals.append(signal)
                    self.delay()

            except Exception as e:
                logger.warning(f"Error scraping r/{subreddit_name}: {e}")
                continue

        # Also do keyword searches
        for phrase in DEMAND_PHRASES[:5]:  # Limit to avoid rate limits
            try:
                for post in self.client.subreddit("all").search(
                    f"peptide {phrase}", sort="new", time_filter="week", limit=20
                ):
                    signal = self._process_post(post, "search")
                    if signal:
                        signals.append(signal)
                    self.delay()
            except Exception as e:
                logger.warning(f"Error searching '{phrase}': {e}")

        return signals

    def _process_post(self, post, subreddit_name: str) -> Signal | None:
        """Process a Reddit post into a Signal if relevant."""
        title = post.title.lower()
        body = (post.selftext or "").lower()
        combined = f"{title} {body}"

        # Quick relevance check — must mention peptides
        peptide_keywords = [
            "peptide", "bpc-157", "bpc157", "tb-500", "tb500",
            "semaglutide", "tirzepatide", "retatrutide", "ipamorelin",
            "cjc-1295", "mk-677", "ghk-cu", "pt-141", "selank", "semax",
            "epithalon", "dsip", "ghrp", "sermorelin", "tesamorelin",
            "aod-9604", "melanotan", "glp-1", "glp1",
        ]

        if not any(kw in combined for kw in peptide_keywords):
            return None

        # Check for demand signals
        has_demand = any(phrase in combined for phrase in DEMAND_PHRASES)
        is_question = post.title.endswith("?") or "?" in post.title

        # Calculate relevance
        relevance = 0.3  # Base for being peptide-related
        if has_demand:
            relevance += 0.3
        if is_question:
            relevance += 0.2
        if post.score > 50:
            relevance += 0.1
        if post.num_comments > 20:
            relevance += 0.1

        return Signal(
            signal_type="reddit_post",
            source_url=f"https://reddit.com{post.permalink}",
            title=post.title,
            raw_content=post.selftext[:2000] if post.selftext else None,
            metadata={
                "subreddit": subreddit_name,
                "upvotes": post.score,
                "comment_count": post.num_comments,
                "created_utc": post.created_utc,
                "flair": str(post.link_flair_text) if post.link_flair_text else None,
                "author": str(post.author) if post.author else "[deleted]",
                "is_question": is_question,
                "has_demand_signal": has_demand,
            },
            relevance_score=min(relevance, 1.0),
        )
