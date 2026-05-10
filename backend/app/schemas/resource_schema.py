from pydantic import (
    BaseModel,
    Field,
    HttpUrl,
    model_validator
)

from typing import (
    List,
    Optional,
    Literal
)

from datetime import datetime

class ResourceCreate(BaseModel):

    title: str = Field(
        ...,
        min_length=3,
        max_length=200
    )

    type: Literal[
        "link",
        "file",
        "image",
        "article",
        "video"
    ]

    description: Optional[str] = Field(
        default=None,
        max_length=1000
    )

    tags: List[str] = Field(default_factory=list)

    url: Optional[HttpUrl] = None

    file_url: Optional[str] = None
    file_path: Optional[str] = None

    content: Optional[str] = None


    @model_validator(mode="after")
    def validate_resource(self):

        if self.type == "link" and not self.url:
            raise ValueError(
                "url required for link"
            )

        if self.type in [
            "file",
            "image",
            "video"
        ] and not self.file_url:
            raise ValueError(
                "file_url required"
            )
        if self.type == "article" and not self.content:
            raise ValueError(
                "content required"
            )

        return self



class ResourceUpdate(BaseModel):

    title: Optional[str] = Field(
        default=None,
        min_length=3,
        max_length=200
    )

    type: Optional[
        Literal[
            "link",
            "file",
            "image",
            "article",
            "video"
        ]
    ] = None

    description: Optional[str] = Field(
        default=None,
        max_length=1000
    )

    tags: Optional[List[str]] = None

    url: Optional[HttpUrl] = None

    file_url: Optional[str] = None
    file_path: Optional[str] = None

    content: Optional[str] = None


    @model_validator(mode="after")
    def validate_resource_update(self):

        if self.type == "link" and not self.url:
            raise ValueError(
                "url required for link"
            )

        if self.type in [
            "file",
            "image",
            "video"
        ] and not self.file_url:
            raise ValueError(
                "file_url required"
            )

        if self.type == "article" and not self.content:
            raise ValueError(
                "content required"
            )

        return self




class ResourceResponse(BaseModel):

    id: str

    title: str

    type: Literal[
        "link",
        "file",
        "image",
        "article",
        "video"
    ]

    description: Optional[str] = None

    tags: List[str]

    url: Optional[str] = None

    file_url: Optional[str] = None
    file_path: Optional[str] = None

    content: Optional[str] = None

    created_at: datetime

    updated_at: datetime




class PaginatedResourceResponse(BaseModel):

    data: List[ResourceResponse]

    page: int

    limit: int

    total: int