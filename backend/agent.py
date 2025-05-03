# backend/agent.py

import os
import re
import requests

class SimpleAgent:
    """
    A basic agent for matching freelancers from the Neo4j graph
    and managing cart operations without external LLMs.
    """
    def __init__(self, driver):
        self.driver = driver
        self.base_url = os.getenv("BACKEND_URL", "http://localhost:8001")
        self.last_results = []
        self.selected = None

    def run(self, message: str):
        msg = message.strip()
        lower_msg = msg.lower()

        # Step 1: User asks for a freelancer with budget and skill
        match = re.search(r"i need an? (.+?) with .*?\$(\d+)", lower_msg)
        if match:
            skill = match.group(1)
            budget = float(match.group(2))
            cypher = (
                f"MATCH (f:Freelancer) "
                f"WHERE f.rate <= {budget} AND '{skill}' IN f.skills "
                f"RETURN f.name AS name, f.rate AS rate, f.portfolio AS portfolio "
                f"ORDER BY f.rate "
                f"LIMIT 5"
            )
            with self.driver.session() as session:
                results = [r.data() for r in session.run(cypher)]
            self.last_results = results
            if not results:
                return f"No freelancers found matching '{skill}' at ${budget}/hr."
            names = [r["name"] for r in results]
            return f"Here are the top matches: {', '.join(names)}. Which do you prefer?"

        # Step 2: User picks a name
        for r in self.last_results:
            if r["name"].lower() == lower_msg:
                self.selected = r
                return (
                    f"{r['name']}'s portfolio: {r['portfolio']}. "
                    "Would you like to proceed and add to cart?"
                )

        # Step 3: User confirms to add to cart
        if lower_msg in ["yes", "add to cart", "proceed"]:
            if self.selected:
                requests.post(f"{self.base_url}/cart/add", json=self.selected)
                return f"{self.selected['name']} has been added to your cart."
            else:
                return "You haven't selected a freelancer yet."

        # Fallback
        return "Sorry, I didn't understand. Please start with 'I need ...'."


def build_agent(driver):
    return SimpleAgent(driver)
