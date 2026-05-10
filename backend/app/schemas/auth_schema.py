from pydantic import Field
from pydantic import BaseModel, EmailStr


class UserSignup(BaseModel):
    name : str = Field(...,min_length=3,max_length=50)
    email: EmailStr
    password : str = Field(...,min_length=3,max_length=50)


class UserLogin(BaseModel):
    email: EmailStr
    password: str