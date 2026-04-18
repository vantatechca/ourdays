import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://postgres:postgres@localhost:5432/peptideiq"

    # Redis
    redis_url: str = "redis://localhost:6379"

    # AI Models
    anthropic_api_key: Optional[str] = None
    openrouter_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None

    # Reddit
    reddit_client_id: Optional[str] = None
    reddit_client_secret: Optional[str] = None
    reddit_user_agent: str = "PeptideIQ/1.0"

    # YouTube
    youtube_api_key: Optional[str] = None

    # Scraping
    default_crawl_delay_ms: int = 5000
    max_concurrent_crawls: int = 5

    # Cost Controls
    daily_api_budget_usd: float = 20.0
    cost_alert_multiplier: float = 2.0

    class Config:
        env_file = "../.env"


settings = Settings()


# Seed keywords for Google Trends and general search
SEED_KEYWORDS = {
    "core": [
        "peptides", "peptide therapy", "peptide protocol", "peptide stack",
        "BPC-157", "TB-500", "semaglutide", "tirzepatide", "retatrutide",
        "CJC-1295", "ipamorelin", "tesamorelin", "sermorelin", "MK-677",
        "PT-141", "DSIP", "selank", "semax", "GHK-Cu", "epithalon",
        "thymosin alpha 1", "thymosin beta 4", "GHRP-6", "GHRP-2",
        "hexarelin", "AOD-9604", "fragment 176-191", "melanotan II",
        "kisspeptin", "gonadorelin", "MGF", "IGF-1 LR3", "follistatin",
    ],
    "product_adjacent": [
        "peptide guide", "peptide course", "peptide calculator",
        "peptide dosage", "peptide reconstitution", "peptide storage",
        "peptide cycle", "peptide for beginners", "peptide tracker",
        "peptide planner", "peptide dosing chart", "peptide stack guide",
        "semaglutide guide", "tirzepatide guide", "GLP-1 guide",
        "peptide ebook", "peptide journal", "peptide template",
    ],
    "niche_crossovers": [
        "peptides for skin", "peptides for gut health",
        "peptides for hair loss", "peptides for sleep",
        "peptides for fat loss", "peptides for injury recovery",
        "peptides for anti-aging",
    ],
    "market_signals": [
        "peptide review", "peptide results", "peptide before after",
        "peptide side effects", "peptide where to buy", "peptide legal",
        "peptide regulation FDA", "compounding pharmacy peptide",
    ],
}

TARGET_SUBREDDITS = [
    "Peptides", "Semaglutide", "Tirzepatide",
    "moreplatesmoredates", "Biohackers", "StackAdvice", "HGH",
    "steroids", "longevity", "Nootropics",
    "AntiAging", "SkincareAddiction",
    "Supplements", "Testosterone",
]

RSS_FEEDS = [
    {"name": "Google News - Peptides", "url": "https://news.google.com/rss/search?q=peptides"},
    {"name": "Google News - Semaglutide", "url": "https://news.google.com/rss/search?q=semaglutide"},
    {"name": "Google News - Tirzepatide", "url": "https://news.google.com/rss/search?q=tirzepatide"},
    {"name": "Google News - Peptide Regulation", "url": "https://news.google.com/rss/search?q=peptide+regulation+FDA"},
    {"name": "PubMed - Peptide Therapy", "url": "https://pubmed.ncbi.nlm.nih.gov/rss/search/1234/?limit=20&utm_campaign=pubmed-2&fc=20230101000000"},
]
