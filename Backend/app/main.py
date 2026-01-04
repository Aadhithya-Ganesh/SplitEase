import logging
import asyncio
from fastapi import FastAPI

logging.basicConfig(
    level=logging.INFO,
    format=f'%(asctime)s - RideService - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

app = FastAPI()

# @app.on_event("startup")
# async def startup_event():
#     init_db()

# @app.get("/health")
# async def health_check():
#     """Health check endpoint - used by load balancer"""
#     db_health = get_db_health()
    
#     is_healthy = (
#         db_health["status"] == "connected" 
#     )
    
#     return {
#         "status": "healthy" if is_healthy else "unhealthy",
#         "checks": {
#             "database": db_health["status"],
#         }
#     }

@app.get("/")
async def root():
    return {"message": "Welcome to SplitEase API"}