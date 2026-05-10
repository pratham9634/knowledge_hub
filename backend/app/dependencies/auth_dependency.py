from fastapi import (Depends,HTTPException,Request)
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from bson import ObjectId
from bson.errors import InvalidId
from app.utils.jwt_handler import verify_token
from app.config.database import db

security = HTTPBearer()
users_collection = db["users"]

def get_current_user(request:Request):

    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="No token")

    payload = verify_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
    except InvalidId:
        raise HTTPException(status_code=401, detail="Invalid token")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["_id"] = str(user["_id"])
    return user


