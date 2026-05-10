def serialize_resource(resource):

    return {
        "id": str(resource["_id"]),
        "title": resource["title"],
        "url": resource["url"],
        "description": resource.get("description"),
        "tags": resource.get("tags", []),
        "created_at": resource["created_at"]
    }