"""YouTube scraper using YouTube Data API v3 or yt-dlp fallback."""

import logging
from config import settings, SEED_KEYWORDS
from scrapers.base import BaseScraper, Signal

logger = logging.getLogger(__name__)


class YouTubeScraper(BaseScraper):
    def __init__(self):
        super().__init__(name="YouTube", platform="youtube", min_delay=2.0, max_delay=5.0)

    async def scrape(self) -> list[Signal]:
        if settings.youtube_api_key:
            return await self._scrape_api()
        return await self._scrape_ytdlp()

    async def _scrape_api(self) -> list[Signal]:
        """Scrape using YouTube Data API v3."""
        import httpx

        signals = []
        search_queries = SEED_KEYWORDS["core"][:10] + [
            "peptide review", "peptide results", "how to use peptides",
            "peptide for beginners", "semaglutide results",
            "peptide reconstitution tutorial",
        ]

        async with httpx.AsyncClient() as client:
            for query in search_queries:
                try:
                    response = await client.get(
                        "https://www.googleapis.com/youtube/v3/search",
                        params={
                            "part": "snippet",
                            "q": query,
                            "type": "video",
                            "order": "date",
                            "maxResults": 10,
                            "key": settings.youtube_api_key,
                        },
                    )

                    if response.status_code != 200:
                        logger.warning(f"YouTube API error for '{query}': {response.status_code}")
                        continue

                    data = response.json()
                    video_ids = [item["id"]["videoId"] for item in data.get("items", []) if "videoId" in item.get("id", {})]

                    # Get video statistics
                    if video_ids:
                        stats_response = await client.get(
                            "https://www.googleapis.com/youtube/v3/videos",
                            params={
                                "part": "statistics,snippet",
                                "id": ",".join(video_ids),
                                "key": settings.youtube_api_key,
                            },
                        )

                        if stats_response.status_code == 200:
                            stats_data = stats_response.json()
                            for video in stats_data.get("items", []):
                                stats = video.get("statistics", {})
                                snippet = video.get("snippet", {})
                                view_count = int(stats.get("viewCount", 0))
                                like_count = int(stats.get("likeCount", 0))
                                comment_count = int(stats.get("commentCount", 0))

                                # Check if creator is selling products (description links)
                                description = snippet.get("description", "").lower()
                                has_product_link = any(
                                    domain in description
                                    for domain in ["gumroad", "etsy", "whop", "shopify", "course", "ebook", "guide"]
                                )

                                relevance = 0.3
                                if view_count > 10000 and has_product_link:
                                    relevance = 0.9
                                elif view_count > 10000:
                                    relevance = 0.6
                                elif comment_count > 50:
                                    relevance = 0.5

                                signals.append(Signal(
                                    signal_type="youtube_video",
                                    source_url=f"https://youtube.com/watch?v={video['id']}",
                                    title=snippet.get("title", ""),
                                    raw_content=snippet.get("description", "")[:2000],
                                    metadata={
                                        "channel": snippet.get("channelTitle", ""),
                                        "view_count": view_count,
                                        "like_count": like_count,
                                        "comment_count": comment_count,
                                        "published_at": snippet.get("publishedAt", ""),
                                        "has_product_link": has_product_link,
                                        "search_query": query,
                                    },
                                    relevance_score=relevance,
                                ))

                    self.delay()

                except Exception as e:
                    logger.warning(f"Error searching YouTube for '{query}': {e}")
                    continue

        return signals

    async def _scrape_ytdlp(self) -> list[Signal]:
        """Fallback: use yt-dlp for metadata scraping (no API key needed)."""
        import subprocess
        import json

        signals = []
        queries = ["peptide guide", "semaglutide dosing", "BPC-157 results"]

        for query in queries:
            try:
                result = subprocess.run(
                    [
                        "yt-dlp", "--dump-json", "--flat-playlist",
                        "--no-download", "--max-downloads", "5",
                        f"ytsearch5:{query}",
                    ],
                    capture_output=True, text=True, timeout=30,
                )

                for line in result.stdout.strip().split("\n"):
                    if not line:
                        continue
                    video = json.loads(line)
                    signals.append(Signal(
                        signal_type="youtube_video",
                        source_url=f"https://youtube.com/watch?v={video.get('id', '')}",
                        title=video.get("title", ""),
                        metadata={
                            "channel": video.get("channel", ""),
                            "view_count": video.get("view_count", 0),
                            "duration": video.get("duration", 0),
                            "search_query": query,
                        },
                        relevance_score=0.4,
                    ))

            except Exception as e:
                logger.warning(f"yt-dlp error for '{query}': {e}")

        return signals
