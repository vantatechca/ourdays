"""
Idea Extraction Pipeline
Raw Signals → Dedup → Relevance Filter → Enrichment → AI Analysis → Scoring → Cross-Check
"""

import logging
from typing import Any

logger = logging.getLogger(__name__)

# Tier 1 LLM extraction prompt
EXTRACTION_PROMPT = """Given this scraped content from {source}, extract any digital product ideas
for the peptide niche.

For each idea, provide:
- title: Clear product name/concept (be specific, not generic)
- summary: 2-3 sentence description of the opportunity
- category: One of [ebook, course, template, calculator, saas_tool, ai_app, membership, printable, tracker, community, coaching, other]
- opportunity_type: proven_model | gap_opportunity | emerging_trend | first_mover | improvement
- peptide_topics: Which peptides or peptide categories this relates to
- sub_niche: longevity | bodybuilding | skincare | cognitive | weight_loss | sexual_health | immune | sleep | general
- target_audience: Who would buy this
- pain_point: What problem does this solve
- evidence: Why you think this would sell (reference the source data)
- effort_to_build: low/medium/high
- estimated_price_range: Based on competitor analysis
- differentiation_angle: What would make this stand out from competitors
- compliance_flag: green/yellow/red with reasoning

Return as JSON array. If no valid ideas, return empty array."""


class IdeaExtractionPipeline:
    """Central processing engine: raw signals → structured scored idea cards."""

    def __init__(self):
        self.pending_signals: list[dict] = []

    async def process_pending_signals(self):
        """Process all pending signals through the full pipeline."""
        if not self.pending_signals:
            logger.info("No pending signals to process.")
            return []

        logger.info(f"Processing {len(self.pending_signals)} signals...")

        # Step 1: Deduplication
        unique_signals = self._deduplicate(self.pending_signals)
        logger.info(f"After dedup: {len(unique_signals)} unique signals")

        # Step 2: Relevance Filter
        relevant_signals = [s for s in unique_signals if s.get("relevance_score", 0) >= 0.4]
        logger.info(f"After relevance filter: {len(relevant_signals)} relevant signals")

        # Step 3: Cluster related signals
        clusters = self._cluster_signals(relevant_signals)
        logger.info(f"Formed {len(clusters)} signal clusters")

        # Step 4: Extract ideas from clusters (would call Tier 1 LLM)
        ideas = []
        for cluster in clusters:
            idea = await self._extract_idea(cluster)
            if idea:
                ideas.append(idea)

        logger.info(f"Extracted {len(ideas)} ideas")
        self.pending_signals = []
        return ideas

    def add_signals(self, signals: list[dict]):
        """Add signals to the processing queue."""
        self.pending_signals.extend(signals)

    def _deduplicate(self, signals: list[dict]) -> list[dict]:
        """Remove duplicate signals based on URL and content similarity."""
        seen_urls = set()
        unique = []
        for signal in signals:
            url = signal.get("source_url", "")
            if url and url not in seen_urls:
                seen_urls.add(url)
                unique.append(signal)
        return unique

    def _cluster_signals(self, signals: list[dict]) -> list[list[dict]]:
        """Group related signals into clusters that represent the same opportunity.

        In production, this would use embedding cosine similarity (>0.85 = same idea).
        For now, cluster by keyword overlap.
        """
        clusters: list[list[dict]] = []
        used = set()

        for i, signal in enumerate(signals):
            if i in used:
                continue

            cluster = [signal]
            used.add(i)

            title_i = (signal.get("title") or "").lower()
            for j, other in enumerate(signals):
                if j in used:
                    continue
                title_j = (other.get("title") or "").lower()
                # Simple overlap check — would be cosine similarity in prod
                words_i = set(title_i.split())
                words_j = set(title_j.split())
                overlap = len(words_i & words_j) / max(len(words_i | words_j), 1)
                if overlap > 0.5:
                    cluster.append(other)
                    used.add(j)

            clusters.append(cluster)

        return clusters

    async def _extract_idea(self, signal_cluster: list[dict]) -> dict | None:
        """Extract a structured idea from a cluster of signals.

        In production, sends the cluster to Tier 1 LLM with EXTRACTION_PROMPT.
        Returns structured idea dict ready for database insertion.
        """
        primary = signal_cluster[0]
        title = primary.get("title", "Untitled Opportunity")

        # Build slug
        slug = title.lower()
        for char in "!@#$%^&*()+=[]{}|;':\",./<>?":
            slug = slug.replace(char, "")
        slug = "-".join(slug.split())[:80]

        return {
            "title": title,
            "slug": slug,
            "summary": primary.get("content_summary") or primary.get("raw_content", "")[:200],
            "category": "other",
            "status": "detected",
            "peptide_topics": [],
            "product_type": [],
            "sub_niche": [],
            "source_urls": [s.get("source_url") for s in signal_cluster if s.get("source_url")],
            "source_platforms": list({s.get("signal_type", "").split("_")[0] for s in signal_cluster}),
            "signal_count": len(signal_cluster),
            "compliance_flag": "yellow",
        }
