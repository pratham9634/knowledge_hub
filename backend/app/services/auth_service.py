from bson import ObjectId
from app.config.database import db
from app.utils.password import (hash_password,verify_password)
from app.utils.jwt_handler import (create_token)

user_collection = db["users"]

def create_user(user_data):
    existing_user = user_collection.find_one({"email":user_data.email})
    if existing_user:
        raise ValueError("User already exists")
    
    hashed_password = hash_password(user_data.password)
    new_user = {
        "name":user_data.name,
        "email":user_data.email,
        "password":hashed_password
    }
    result = user_collection.insert_one(new_user)
    
    token = create_token({"user_id":str(result.inserted_id)})
    return {"user_id":str(result.inserted_id),"token":token}

def login_user(login_data):
    user = user_collection.find_one({"email":login_data.email})
    if not user:
        raise ValueError("User not found")
    
    if not verify_password(login_data.password,user["password"]):
        raise ValueError("Invalid password")
    
    token = create_token({"user_id":str(user["_id"])})
    return {"user_id":str(user["_id"]),"token":token}


