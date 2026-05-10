from app.services.upload_service import delete_file
from typing import Optional
from datetime import datetime, timezone
from bson import ObjectId
from app.config.database import db


resources_collection = db["resources"]

#create resource function 
def create_resource(resource_data, user_id):
    new_resource = {

    "title": resource_data.title,

    "type": resource_data.type,

    "description": resource_data.description,

    "tags": resource_data.tags,

    "url": (
        str(resource_data.url)
        if resource_data.url
        else None
    ),

    "file_url": resource_data.file_url,
    "file_path": resource_data.file_path,

    "content": resource_data.content,

    "created_at": datetime.now(
        timezone.utc
    ),

    "updated_at": datetime.now(
        timezone.utc
    ),

    "user_id": user_id
}

    result = resources_collection.insert_one(new_resource)

    new_resource["_id"] = str(result.inserted_id)

    return new_resource


#get all resources function 
def get_resources(
    user_id:str,
    search:str,
    resource_type:Optional[str]=None,
    page:int = 1,
    limit:int = 10,
    tag:Optional[str]= None):
    
    query = {"user_id": user_id}

    if search:
        query["title"] = {
            "$regex": search,
            "$options": "i"
        }

    if resource_type:
        query["type"] = resource_type    

    if tag:
        query["tags"] = tag

    skip = (page -1) * limit

    resources = list(
        resources_collection.find(query)
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )

    total = resources_collection.count_documents(
        query
    )
    
    for resource in resources:
        resource["_id"] = str(resource["_id"])
        if "created_at" in resource and resource["created_at"].tzinfo is None:
            resource["created_at"] = resource["created_at"].replace(tzinfo=timezone.utc)
        if "updated_at" in resource and resource["updated_at"].tzinfo is None:
            resource["updated_at"] = resource["updated_at"].replace(tzinfo=timezone.utc)

    return {
        "data": resources,
        "page": page,
        "limit": limit,
        "total": total
    }


#get all unique tags for a user
def get_unique_tags(user_id:str):
    tags = resources_collection.distinct("tags", {"user_id": user_id})
    return tags

#get resource by id  function 
def get_resource_by_id(user_id:str,resource_id:str):
    resource = resources_collection.find_one({
        "_id":ObjectId(resource_id),
        "user_id":user_id
    })
    if not resource:
        return None
    
    resource["_id"] = str(resource["_id"])
    if "created_at" in resource and resource["created_at"].tzinfo is None:
        resource["created_at"] = resource["created_at"].replace(tzinfo=timezone.utc)
    if "updated_at" in resource and resource["updated_at"].tzinfo is None:
        resource["updated_at"] = resource["updated_at"].replace(tzinfo=timezone.utc)
    return resource


#update resource function 
def update_resource(user_id:str,resource_id:str,update_data:dict):
    existing_resource = resources_collection.find_one({
        "_id": ObjectId(resource_id),
        "user_id": user_id
    })

    if not existing_resource:
        return None
    
    update_data = update_data.model_dump(exclude_unset=True)

    update_fields = {
        key : str(value) if key == "url" and value is not None else value
        for key,value in update_data.items()
        if value is not None
    }    

    update_fields["updated_at"] = datetime.now(
        timezone.utc
    )

    result = resources_collection.update_one(
        {"_id":ObjectId(resource_id),"user_id":user_id},
        {"$set":update_fields}
    )

    if result.modified_count == 0:
        return None

    updated_resource = resources_collection.find_one({
        "_id": ObjectId(resource_id)
    })
    updated_resource["_id"] = str(
        updated_resource["_id"]
    )
    if "created_at" in updated_resource and updated_resource["created_at"].tzinfo is None:
        updated_resource["created_at"] = updated_resource["created_at"].replace(tzinfo=timezone.utc)
    if "updated_at" in updated_resource and updated_resource["updated_at"].tzinfo is None:
        updated_resource["updated_at"] = updated_resource["updated_at"].replace(tzinfo=timezone.utc)

    return updated_resource

#delete resource function 
def delete_resource(user_id:str,resource_id:str):
    resource = resources_collection.find_one({
        "_id": ObjectId(resource_id),
        "user_id": user_id
    })
    if not resource:
        return False

    if resource["type"] in [
        "file",
        "image",
        "video"
    ]:
        try:
            delete_file(resource["file_path"])
        except Exception as e:
            pass
    
    result = resources_collection.delete_one(
        {"_id":ObjectId(resource_id),"user_id":user_id}
    )
    if result.deleted_count == 0:
        return None
    return {
        "message":"Resource deleted successfully",
        "_id":resource_id
    }