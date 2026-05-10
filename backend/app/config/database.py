from pymongo.server_api import ServerApi
from pymongo import MongoClient
from app.config.settings import settings


client = MongoClient(settings.MONGO_URI)

db = client[settings.DATABASE_NAME]

db["users"].create_index("email", unique=True)
db["resources"].create_index("title")
db["resources"].create_index("tags")
db["resources"].create_index("user_id")
db["resources"].create_index("type")

