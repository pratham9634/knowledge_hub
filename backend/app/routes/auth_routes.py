from fastapi import APIRouter , HTTPException,Response, Depends
from app.schemas.auth_schema import UserSignup, UserLogin
from app.services.auth_service import create_user, login_user
from app.dependencies.auth_dependency import get_current_user

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)


@router.post("/signup")
def signup(user:UserSignup):
    try:
        result = create_user(user)
        
        if not result:
            raise HTTPException(status_code=409, detail="User already exists")
            
        token_str = result["token"]
        return {
            "message": "User created successfully",
            "access_token": token_str
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
def login(user:UserLogin,response:Response):
    try:
        result = login_user(user)
        if not result:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        token_str = result["token"]
        
        response.set_cookie("access_token",token_str,httponly=True,secure=True,samesite="none",max_age=3600)
        return {
            "message": "Login successful",
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/logout")
def logout(response: Response):

    response.delete_cookie(
        key="access_token"
    )

    return {
        "message": "Logged out successfully"
    }

@router.get("/me")
def get_me(current_user = Depends(get_current_user)):
    return current_user
