import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.routes.auth import router as auth_router
from app.routes.bill import router as bill_router
from app.routes.group import router as group_router
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db, get_db_health

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - SplitEase 2026 - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 🔹 STARTUP
    logger.info("Starting SplitEase API...")
    init_db()

    yield

    # 🔹 SHUTDOWN
    logger.info("Shutting down SplitEase API...")


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint - used by load balancer"""
    db_health = get_db_health()

    is_healthy = db_health["status"] == "connected"

    return {
        "status": "healthy" if is_healthy else "unhealthy",
        "checks": {
            "database": db_health["status"],
        },
    }


app.include_router(auth_router)
app.include_router(bill_router)
app.include_router(group_router)
