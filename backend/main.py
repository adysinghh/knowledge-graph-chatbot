# backend/main.py

import os
import re
import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

# Neo4j Connection
NEO4J_URI  = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASS = os.getenv("NEO4J_PASS", "password")
driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASS))

# FastAPI App & CORS
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In‐Memory State 
LAST_RESULTS: list[dict] = []
CART: list[dict] = []

# Request Models
class ChatRequest(BaseModel):
    message: str

class CypherQuery(BaseModel):
    cypher: str

# Helper Functions
def parse_user_request(text: str) -> tuple[float, list[str]]:
    """Extract budget and normalized skill keywords from user text."""
    m = re.search(r"\$(\d+)", text)
    budget = float(m.group(1)) if m else None

    clean = re.sub(r"\$\d+", "", text.lower())
    syn = {
        "ml": "machine learning",
        "app dev": "application development",
        "app developer": "application development",
        "dev": "development"
    }
    for k, v in syn.items():
        clean = clean.replace(k, v)

    for w in ["i", "need", "an", "a", "with", "budget", "hour", "hr", "rate", "the"]:
        clean = re.sub(rf"\b{w}\b", "", clean)

    kws = [tok.strip() for tok in clean.split() if tok.strip()]
    return budget, kws

def query_freelancers(budget: float, keywords: list[str]) -> list[dict]:
    """Run a Cypher query matching budget + any keyword in skill names."""
    skill_filters = " OR ".join(
        [f"toLower(s.name) CONTAINS '{kw}'" for kw in keywords]
    )
    cypher = (
        "MATCH (f:Freelancer)-[:HAS_SKILL]->(s:Skill) "
        f"WHERE f.rate <= {budget} AND ({skill_filters}) "
        "RETURN f.name AS name, f.rate AS rate, f.portfolio AS portfolio "
        "LIMIT 5"
    )
    with driver.session() as session:
        result = session.run(cypher)
        return [r.data() for r in result]

# --- Endpoints ---

@app.post("/query-graph")
async def run_cypher(q: CypherQuery):
    """For debugging: run arbitrary Cypher."""
    try:
        with driver.session() as session:
            result = session.run(q.cypher)
            return {"results": [r.data() for r in result]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/chat")
async def chat(req: ChatRequest):
    """Core chat logic: find freelancers, handle selection, manage cart."""
    global LAST_RESULTS, CART
    try:
        text = req.message.strip()

        # If the user replies with a number, add that index to cart
        if text.isdigit() and LAST_RESULTS:
            idx = int(text) - 1
            if 0 <= idx < len(LAST_RESULTS):
                chosen = LAST_RESULTS[idx]
                CART.append(chosen)
                return {
                    "response": (
                        f"Added {chosen['name']} (${chosen['rate']}/hr) to your cart. "
                        f"Portfolio: {chosen['portfolio']}\n"
                        "Type another number to add more, or 'view cart' to open your cart."
                    )
                }
            else:
                return {"response": "Invalid selection number. Please try again."}

        # If user requests to view cart
        if text.lower() in ("view cart", "open cart"):
            return {"response": "Opening cart…"}

        # Otherwise interpret as a find request
        budget, kws = parse_user_request(text)
        if budget is None or not kws:
            return {
                "response": (
                    "Sorry, I couldn't understand your request. "
                    "Try e.g. 'I need an ML developer at $30/hr'."
                )
            }

        LAST_RESULTS = query_freelancers(budget, kws)
        if not LAST_RESULTS:
            return {"response": f"No freelancers found at ${budget}/hr matching your keywords."}

        resp = "Here are the top matches:\n\n"
        for i, f in enumerate(LAST_RESULTS, start=1):
            resp += f"{i}. {f['name']} (${f['rate']}/hr)\n\n"
        resp += "Reply with the number to add to your cart."
        return {"response": resp}

    except Exception:
        traceback.print_exc()
        return {"response": "Error: something went wrong on the server."}

@app.get("/cart")
async def get_cart():
    """Return the current in‐memory cart."""
    return {"cart": CART}
