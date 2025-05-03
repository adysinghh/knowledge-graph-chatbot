# backend/etl.py
import os
import csv
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()
uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
user = os.getenv("NEO4J_USER", "neo4j")
password = os.getenv("NEO4J_PASS", "password")

driver = GraphDatabase.driver(uri, auth=(user, password))

def clear_graph(tx):
    tx.run("MATCH (n) DETACH DELETE n")

def load_freelancers(tx, row):
    tx.run(
        """
        MERGE (f:Freelancer {name: $name})
        SET f.rate = toFloat($rate),
            f.skills = $skills,
            f.portfolio = $portfolio
        """,
        name=row["name"],
        rate=row["rate"],
        skills=row["skills"].split(";"),
        portfolio=row["portfolio"]
    )
    for skill in row["skills"].split(";"):
        tx.run(
            """
            MERGE (s:Skill {name: $skill})
            WITH s
            MATCH (f:Freelancer {name: $name})
            MERGE (f)-[:HAS_SKILL]->(s)
            """,
            skill=skill,
            name=row["name"]
        )

def ingest_csv(path="data/freelancers.csv"):
    with driver.session() as session:
        session.write_transaction(clear_graph)
        with open(path, newline="") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                session.write_transaction(load_freelancers, row)
    print("Ingestion complete.✅")

if __name__ == "__main__":
    ingest_csv()
