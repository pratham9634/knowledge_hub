from fastapi import Depends,FastAPI
from app.routes.auth_routes import router as auth_router
from app.routes.resource_route import router as resource_router
from fastapi.middleware.cors import CORSMiddleware
from app.routes.upload_route import router as upload_router
import os

app = FastAPI()

# Build allowed origins list
allowed_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(resource_router)
app.include_router(upload_router)

@app.get("/")
def root():
    return {"Hello": "Worlddddddddddd"}


@app.get("/health")
def health_check():

    return {
        "status": "healthy"
    }    