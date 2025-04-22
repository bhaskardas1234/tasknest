from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import redis

DATABASE_URL = "postgresql://postgres:root@localhost:5432/qverse-to-do"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)
