from app.services.upload_service import (
    upload_file,
    validate_file,

    ALLOWED_IMAGE_TYPES,
    ALLOWED_VIDEO_TYPES,
    ALLOWED_FILE_TYPES,

    MAX_IMAGE_SIZE,
    MAX_VIDEO_SIZE,
    MAX_FILE_SIZE
)
from app.dependencies.auth_dependency import get_current_user
from fastapi import APIRouter,UploadFile,File, HTTPException,Depends

router = APIRouter(prefix='/api/uploads',tags=['uploads'])

@router.post("/image")
def upload_image(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    validate_file(file,ALLOWED_IMAGE_TYPES,MAX_IMAGE_SIZE)
    upload = upload_file(file,"images")
    return upload

@router.post("/video")
def upload_video(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    validate_file(file,ALLOWED_VIDEO_TYPES,MAX_VIDEO_SIZE)
    upload = upload_file(file,"videos")
    return upload

@router.post("/file")
def upload_general_file(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    validate_file(file,ALLOWED_FILE_TYPES,MAX_FILE_SIZE)
    upload = upload_file(file,"files")
    return upload    