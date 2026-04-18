"""Google Trends scraper using pytrends."""

import logging
from datetime import datetime, timezone
from config import SEED_KEYWORDS
from scrapers.base import BaseScraper, Signal

logger = logging.getLogger(__name__)


class GoogleTrendsScraper(BaseScraper):
    def __init__(self):
        super().__init__(name="Google Trends", platform="google_trends", min_delay=12.0, max_delay=20.0)

    async def scrape(self) -> list[Signal]:
        from pytrends.request import TrendReq

        pytrends = TrendReq(hl="en-US", tz=360)
        signals = []

        # Process keywords in batches of 5 (Google Trends limit)
        all_keywords = SEED_KEYWORDS["core"] + SEED_KEYWORDS["product_adjacent"]
        batches = [all_keywords[i:i + 5] for i in range(0, len(all_keywords), 5)]

        for batch in batches[:10]:  # Limit batches to avoid rate limiting
            try:
                pytrends.build_payload(batch, cat=0, timeframe="today 3-m", geo="US")

                # Interest over time
                interest_df = pytrends.interest_over_time()
                if not interest_df.empty:
                    for keyword in batch:
                        if keyword in interest_df.columns:
                            values = interest_df[keyword].tolist()
                            if len(values) >= 4:
                                recent = sum(values[-4:]) / 4
                                earlier = sum(values[:4]) / 4 if values[:4] else 1
                                pct_change = ((recent - earlier) / max(earlier, 1)) * 100

                                direction = "stable"
                                if pct_change > 200:
                                    direction = "breakout"
                                elif pct_change > 25:
                                    direction = "rising"
                                elif pct_change < -15:
                                    direction = "declining"

                                signals.append(Signal(
                                    signal_type="google_trend",
                                    source_url=f"https://trends.google.com/trends/explore?q={keyword.replace(' ', '+')}",
                                    title=f"Google Trends: {keyword}",
                                    metadata={
                                        "keyword": keyword,
                                        "trend_direction": direction,
                                        "interest_value": int(recent),
                                        "percent_change": round(pct_change, 1),
                                        "timeframe": "3m",
                                        "geo": "US",
                                    },
                                    relevance_score=min(recent / 100, 1.0),
                                ))

                # Related queries (gold for ideas)
                try:
                    related = pytrends.related_queries()
                    for keyword in batch:
                        if keyword in related and related[keyword]["rising"] is not None:
                            rising_df = related[keyword]["rising"]
                            for _, row in rising_df.head(5).iterrows():
                                signals.append(Signal(
                                    signal_type="google_trend",
                                    source_url=f"https://trends.google.com/trends/explore?q={row['query'].replace(' ', '+')}",
                                    title=f"Rising query: {row['query']} (related to {keyword})",
                                    metadata={
                                        "keyword": row["query"],
                                        "parent_keyword": keyword,
                                        "trend_direction": "rising",
                                        "rise_value": int(row["value"]) if row["value"] != "Breakout" else 5000,
                                        "is_breakout": row["value"] == "Breakout",
                                    },
                                    relevance_score=0.8 if row["value"] == "Breakout" else 0.5,
                                ))
                except Exception as e:
                    logger.warning(f"Error fetching related queries: {e}")

                self.delay()

            except Exception as e:
                logger.warning(f"Error processing batch {batch}: {e}")
                self.delay()
                continue

        return signals
