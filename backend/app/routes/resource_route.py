from typing import Optional
from fastapi import APIRouter,Depends,HTTPException,Query
from app.schemas.resource_schema import ResourceCreate,ResourceUpdate
from app.dependencies.auth_dependency import get_current_user
from app.services.resource_service import create_resource,get_resources,get_resource_by_id,update_resource,delete_resource,get_unique_tags


router = APIRouter(
    prefix="/api/resources",
    tags=["resources"],
)

#create resource
@router.post("/")
def create_new_resource(
    resource: ResourceCreate,
    current_user = Depends(get_current_user)
):
    new_resource = create_resource(resource,current_user["_id"])
    return {
        "message": "Resource created",
        "data": new_resource
    }

#get all resource
@router.get("/")
def get_all_resources(
    search: str = None,
    type: str = None,
    tag: str = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=50),
    current_user=Depends(get_current_user)
):
    resources = get_resources(
        user_id=current_user["_id"],
        search=search,
        resource_type=type,
        page=page,
        limit=limit,
        tag=tag
    )

    return {
        "message": "Resources fetched successfully",
        "resources" : resources
    }   

#get all tags
@router.get("/tags")
def get_user_tags(
    current_user=Depends(get_current_user)
):
    tags = get_unique_tags(user_id=current_user["_id"])
    return {
        "message": "Tags fetched successfully",
        "data": tags
    }

#get single resource by id
@router.get("/{resource_id}")
def get_single_resource(
    resource_id:str,
    current_user = Depends(get_current_user)
):
    try:
        resource = get_resource_by_id(
        current_user["_id"],
        resource_id
    )
        if not resource:
            raise HTTPException(status_code=404,detail="Resource not found")
        return {
            "message": "Resource fetched successfully",
            "data": resource
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

#update resource by id
@router.put("/{resource_id}")
def update_resource_by_id(
    resource_id:str,
    update_data:ResourceUpdate,
    current_user = Depends(get_current_user)
):
    try:
        resource = update_resource(
            user_id=current_user["_id"],
            resource_id=resource_id,
            update_data=update_data
        )
        if not resource:
            raise HTTPException(status_code=404,detail="Resource not found")
        return {
            "message": "Resource updated successfully",
            "data": resource
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

#delete resource by id
@router.delete("/{resource_id}")
def delete_resource_by_id(
    resource_id:str,
    current_user = Depends(get_current_user)
):
    try:
        resource = delete_resource(
            user_id=current_user["_id"],
            resource_id=resource_id
        )
        if not resource:
            raise HTTPException(status_code=404,detail="Resource not found")
        return {
            "message": "Resource deleted successfully",
            "data": resource
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))