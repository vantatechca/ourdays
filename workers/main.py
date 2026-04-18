"""
PeptideIQ Research Engine — FastAPI sidecar
Exposes endpoints for triggering scrapers and managing the research pipeline.
"""

from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from scrapers.reddit_scraper import RedditScraper
from scrapers.google_trends_scraper import GoogleTrendsScraper
from scrapers.rss_scraper import RssScraper
from scrapers.youtube_scraper import YouTubeScraper
from pipeline.extraction import IdeaExtractionPipeline
from scoring.scorer import OpportunityScorer

app = FastAPI(title="PeptideIQ Research Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Scraper instances
scrapers = {
    "reddit": RedditScraper(),
    "google_trends": GoogleTrendsScraper(),
    "rss": RssScraper(),
    "youtube": YouTubeScraper(),
}

pipeline = IdeaExtractionPipeline()
scorer = OpportunityScorer()


@app.get("/health")
async def health():
    return {"status": "ok", "scrapers": list(scrapers.keys())}


@app.get("/scrapers/status")
async def scraper_status():
    return {name: s.get_status() for name, s in scrapers.items()}


@app.post("/scrapers/{name}/run")
async def run_scraper(name: str, background_tasks: BackgroundTasks):
    if name not in scrapers:
        return {"error": f"Unknown scraper: {name}"}, 404

    scraper = scrapers[name]
    background_tasks.add_task(scraper.run)
    return {"status": "started", "scraper": name}


@app.post("/scrapers/run-all")
async def run_all_scrapers(background_tasks: BackgroundTasks):
    for name, scraper in scrapers.items():
        background_tasks.add_task(scraper.run)
    return {"status": "started", "scrapers": list(scrapers.keys())}


@app.post("/pipeline/process")
async def process_pipeline(background_tasks: BackgroundTasks):
    background_tasks.add_task(pipeline.process_pending_signals)
    return {"status": "processing"}


@app.post("/scoring/rescore-all")
async def rescore_all(background_tasks: BackgroundTasks):
    background_tasks.add_task(scorer.rescore_all_ideas)
    return {"status": "rescoring"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
