import uuid
from fastapi import HTTPException
from app.config.supabase import supabase_client
from app.config.settings import settings


def upload_file(
    file,
    folder
):

    file_extension = (
        file.filename.split(".")[-1]
    )

    unique_filename = (
        f"{uuid.uuid4()}.{file_extension}"
    )

    file_path = (
        f"{folder}/{unique_filename}"
    )

    supabase_client.storage \
        .from_(settings.SUPABASE_BUCKET) \
        .upload(
            file_path,
            file.file.read(),
            {
                "content-type": file.content_type
            }
        )

    public_url = supabase_client.storage \
        .from_(settings.SUPABASE_BUCKET) \
        .get_public_url(file_path)

    return {
        "file_url": public_url,
        "file_path": file_path
    }

def delete_file(file_path):
    try:
        supabase_client.storage.from_(settings.SUPABASE_BUCKET).remove(file_path)
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))



# validate file type and size
ALLOWED_IMAGE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp"
]
ALLOWED_VIDEO_TYPES = [
    "video/mp4",
    "video/webm",
    "video/quicktime"
]
ALLOWED_FILE_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]
MAX_IMAGE_SIZE = 5 * 1024 * 1024
MAX_VIDEO_SIZE = 100 * 1024 * 1024
MAX_FILE_SIZE = 20 * 1024 * 1024


def validate_file(
    file,
    allowed_types,
    max_size
):

    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: '{file.content_type}'. Allowed types: {', '.join(allowed_types)}"
        )

    content = file.file.read()

    if len(content) > max_size:

        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max size is {max_size} bytes."
        )

    file.file.seek(0)