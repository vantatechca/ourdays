"""
Opportunity Scoring Engine
5-dimension scoring: Demand, Competition, Revenue, Build Effort, Trend
Each dimension 0-100. Composite = weighted average with golden rule modifiers.
"""

import logging
from typing import Any

logger = logging.getLogger(__name__)

# Default weights (each 20%)
DEFAULT_WEIGHTS = {
    "trend": 0.20,
    "demand": 0.20,
    "competition": 0.20,
    "feasibility": 0.20,
    "revenue": 0.20,
}


class OpportunityScorer:
    """Scores ideas across 5 dimensions and applies golden rule modifiers."""

    def __init__(self, weights: dict[str, float] | None = None):
        self.weights = weights or DEFAULT_WEIGHTS

    def score_idea(self, idea: dict, rules: list[dict] | None = None, patterns: list[dict] | None = None) -> dict:
        """Score an idea and return all sub-scores + composite."""

        trend = self._score_trend(idea)
        demand = self._score_demand(idea)
        competition = self._score_competition(idea)
        feasibility = self._score_feasibility(idea)
        revenue = self._score_revenue(idea)

        composite = (
            self.weights["trend"] * trend
            + self.weights["demand"] * demand
            + self.weights["competition"] * competition
            + self.weights["feasibility"] * feasibility
            + self.weights["revenue"] * revenue
        )

        # Apply golden rules
        if rules:
            composite = self._apply_golden_rules(idea, composite, rules)

        # Apply feedback patterns
        if patterns:
            composite = self._apply_feedback_patterns(idea, composite, patterns)

        # Clamp to 0-100
        composite = max(0, min(100, composite))

        # Confidence score
        confidence = self._calculate_confidence(idea)

        return {
            "trend_score": round(trend, 1),
            "demand_score": round(demand, 1),
            "competition_score": round(competition, 1),
            "feasibility_score": round(feasibility, 1),
            "revenue_potential_score": round(revenue, 1),
            "composite_score": round(composite, 1),
            "confidence_score": round(confidence, 1),
        }

    def _score_trend(self, idea: dict) -> float:
        """Score based on Google Trends trajectory and growth signals."""
        score = 30  # Base

        trends_score = idea.get("google_trends_score", 0)
        direction = idea.get("google_trends_direction", "stable")

        # Google Trends value
        score += (trends_score or 0) * 0.4

        # Direction bonus
        direction_bonus = {
            "breakout": 25,
            "rising": 15,
            "stable": 0,
            "declining": -15,
        }
        score += direction_bonus.get(direction, 0)

        return max(0, min(100, score))

    def _score_demand(self, idea: dict) -> float:
        """Score based on proven demand: Reddit questions, search volume, forum activity."""
        score = 10  # Base

        reddit_mentions = idea.get("reddit_mention_count", 0)
        reddit_questions = idea.get("reddit_question_count", 0)
        youtube_videos = idea.get("youtube_video_count", 0)
        search_volume = idea.get("search_volume_monthly", 0)

        # Reddit activity
        if reddit_mentions > 1000:
            score += 30
        elif reddit_mentions > 500:
            score += 20
        elif reddit_mentions > 100:
            score += 10

        # Reddit questions (strongest demand signal)
        if reddit_questions > 500:
            score += 25
        elif reddit_questions > 100:
            score += 15
        elif reddit_questions > 30:
            score += 8

        # YouTube coverage
        if youtube_videos > 100:
            score += 15
        elif youtube_videos > 30:
            score += 10
        elif youtube_videos > 10:
            score += 5

        # Search volume
        if search_volume and search_volume > 1000:
            score += 20
        elif search_volume and search_volume > 500:
            score += 10

        return max(0, min(100, score))

    def _score_competition(self, idea: dict) -> float:
        """Score based on competition saturation. Lower competition = higher score."""
        score = 80  # Start high, subtract for competition

        etsy = idea.get("etsy_competitor_count", 0)
        whop = idea.get("whop_competitor_count", 0)
        total_competitors = etsy + whop

        # Competitor count penalty
        if total_competitors == 0:
            score = 100  # Blue ocean
        elif total_competitors <= 3:
            score = 90
        elif total_competitors <= 6:
            score = 75
        elif total_competitors <= 10:
            score = 60
        elif total_competitors <= 15:
            score = 45
        else:
            score = 30

        return max(0, min(100, score))

    def _score_feasibility(self, idea: dict) -> float:
        """Score based on how easy it is to build."""
        effort = idea.get("effort_to_build", "medium")
        category = idea.get("category", "other")

        effort_scores = {"low": 90, "medium": 60, "high": 35}
        score = effort_scores.get(effort, 50)

        # Category adjustment
        easy_categories = {"template", "printable", "ebook", "calculator"}
        hard_categories = {"saas_tool", "ai_app", "course", "community"}
        if category in easy_categories:
            score += 10
        elif category in hard_categories:
            score -= 10

        return max(0, min(100, score))

    def _score_revenue(self, idea: dict) -> float:
        """Score based on revenue potential."""
        score = 40  # Base

        price_range = idea.get("estimated_price_range", "")
        category = idea.get("category", "other")

        # Subscription > one-time
        if "/mo" in price_range:
            score += 25
        elif "$49" in price_range or "$99" in price_range or "$149" in price_range:
            score += 20
        elif "$29" in price_range or "$24" in price_range:
            score += 10

        # Category revenue potential
        high_rev_categories = {"saas_tool", "ai_app", "membership", "course", "coaching"}
        low_rev_categories = {"printable", "template"}
        if category in high_rev_categories:
            score += 15
        elif category in low_rev_categories:
            score -= 10

        return max(0, min(100, score))

    def _apply_golden_rules(self, idea: dict, composite: float, rules: list[dict]) -> float:
        """Apply golden rule modifiers to composite score."""
        for rule in rules:
            if not rule.get("is_active") or not rule.get("approved"):
                continue

            direction = rule.get("direction", "boost")
            weight = rule.get("weight", 1.0)

            # Simple keyword matching (in prod, use AI to evaluate)
            rule_text = rule.get("rule_text", "").lower()
            idea_text = f"{idea.get('title', '')} {idea.get('category', '')} {' '.join(idea.get('peptide_topics', []))}".lower()

            # Check if rule applies (simplified)
            applies = False
            if "saas" in rule_text and idea.get("category") in ("saas_tool", "ai_app"):
                applies = True
            elif "ebook" in rule_text and idea.get("category") == "ebook":
                applies = True
            elif "recurring" in rule_text and "/mo" in idea.get("estimated_price_range", ""):
                applies = True
            elif "printable" in rule_text and idea.get("category") == "printable":
                applies = True
            elif any(word in idea_text for word in rule_text.split() if len(word) > 4):
                applies = True

            if applies:
                if direction == "block":
                    return 0  # Auto-decline
                elif direction == "penalize":
                    composite -= weight * 20
                elif direction == "boost":
                    composite += weight * 20
                elif direction == "require":
                    composite -= 30  # Penalty for not meeting requirement

        return composite

    def _apply_feedback_patterns(self, idea: dict, composite: float, patterns: list[dict]) -> float:
        """Apply learned feedback patterns as soft modifiers."""
        for pattern in patterns:
            if not pattern.get("is_active"):
                continue

            confidence = pattern.get("confidence", 0.5)
            if confidence < 0.5:
                continue

            # Simplified pattern matching
            pattern_key = pattern.get("pattern_key", "")
            adjustment = confidence * 5  # Soft adjustment: max ~5 points

            if "saas" in pattern_key and idea.get("category") in ("saas_tool", "ai_app"):
                composite += adjustment
            elif "ebook" in pattern_key and idea.get("category") == "ebook":
                composite -= adjustment

        return composite

    def _calculate_confidence(self, idea: dict) -> float:
        """Calculate how confident we are in the scoring.
        Based on signal count and source diversity."""
        signal_count = idea.get("signal_count", len(idea.get("source_urls", [])))
        source_count = len(set(idea.get("source_platforms", [])))

        if signal_count >= 10 and source_count >= 3:
            return 90
        elif signal_count >= 5 and source_count >= 2:
            return 70
        elif signal_count >= 2:
            return 50
        else:
            return 25

    async def rescore_all_ideas(self):
        """Re-score all ideas in the database. Called when rules change."""
        logger.info("Re-scoring all ideas...")
        # TODO: Fetch all ideas from DB, re-score each, update DB
        logger.info("Re-scoring complete.")
