from flask import request
from flask_jwt_extended import create_access_token
from flask_restful import Resource
from root.general.commonUtilis import (
    bcryptPasswordHash,
    cleanupEmail,
    maskEmail,
    mdbObjectIdToStr,
    verifyPassword,
)
from root.general.authUtils import validate_auth
from root.static import G_ACCESS_EXPIRES
from root.db import get_users_collection  # Import helper function


class Login(Resource):
    def post(self):
        data = request.get_json()

        # Add the validation logic using the marshmallow schema
        # ... code here

        email = data.get("email")
        password = data.get("password")

        userMeta = {
            "email": email,
            "password": password,
        }

        return login(userMeta, {})


def login(data, filter, isRedirect=True):
    email = cleanupEmail(data.get("email"))

    # Feel free to add any additional filter conditions here depending on your use case
    filter = {"email": email, "status": {"$nin": ["deleted", "removed", "suspended"]}}

    users = get_users_collection()  # Use helper function for collection
    userDoc = users.find_one(filter)

    if not (userDoc and "_id" in userDoc):
        return {
            "status": 0,
            "cls": "error",
            "msg": "Invalid email id and password. Please try again",
        }

    userStatus = userDoc.get("status")

    if userStatus == "pending":
        return {
            "status": 0,
            "cls": "error",
            "msg": "Your Request is still pending, Contact admin for more info",
            "payload": {
                "redirect": "/adminApproval",
                "userMeta": userDoc,
            },
        }

    password = data.get("password")

    isDbPasswordMatch = (
        True
        if userDoc
        and ("password" in userDoc)
        and verifyPassword(userDoc["password"], password)
        else False
    )

    uid = mdbObjectIdToStr(userDoc["_id"])
    access_token = create_access_token(identity=uid, expires_delta=G_ACCESS_EXPIRES)

    payload = {
        "accessToken": access_token,
        "uid": uid,
        "redirectUrl": "/dashboard",
    }

    return {
        "status": 1,
        "cls": "success",
        "msg": "Login successful. Please be patient, it will redirect automatically!",
        "payload": payload,
    }


class UserLogout(Resource):
    @validate_auth(optional=True)
    def post(self, suid, suser):
        content = request.get_json(silent=True)

        # Add the log out logic here
        # ... code here

        return {
            "status": 1,
            "cls": "success",
            "msg": "Logged out successfully!",
        }


def logLoginSessions(uid, user, isLoggedIn=False, tokens=None, extra={}):
    # Log the login session details here

    return {
        "status": 1,
        "cls": "success",
        "msg": "Success",
    }


class UserRegister(Resource):
    @validate_auth(optional=True)
    def post(self, suid, suser):
        input = request.get_json(silent=True)

        # Add the validation logic using the marshmallow schema
        # ... code here

        # Check if the user email already exists
        email = input["email"]
        users = get_users_collection()  # Use helper function for collection
        currentUser = users.find_one({"email": email})

        if currentUser and "_id" in currentUser:
            maskedEmail = maskEmail(email)
            return {
                "status": 0,
                "cls": "error",
                "msg": f"Email ID ({maskedEmail}) already exists",
                "payload": {},
            }

        # New user, here we should cleanup the data
        email = input["email"]
        password = input["password"]
        newPassword = bcryptPasswordHash(password)
        avatarUrl = input.get("avatarUrl", "/avatar.svg")

        # Additional meta if needed
        newUserBrowserMeta = {}

        newUser = {
            "email": email,
            "password": newPassword,
            "avatarUrl": avatarUrl,
            **newUserBrowserMeta,
            "status": "active",
        }

        users.insert_one(newUser)

        payload = {
            "ruid": newUser["_id"],
            "redirect": "/login",
        }

        return {
            "status": 1,
            "cls": "success",
            "msg": "Congratulations! You have successfully registered. Please login to continue",
            "payload": payload,
        }


class ForgetPassword(Resource):
    @validate_auth(optional=True)
    def post(self, suid, suser):
        input = request.get_json(silent=True)
        email = input["email"]

        # Add the validation logic using the marshmallow schema
        # ... code here

        users = get_users_collection()  # Use helper function for collection
        user = users.find_one({"email": email})

        if not (user and "_id" in user):
            return {
                "status": 0,
                "cls": "error",
                "msg": "User not found",
                "payload": {},
            }

        newPassword = input["newPassword"]
        hashedPassword = bcryptPasswordHash(newPassword)

        users.update_one(
            {"_id": user["_id"]},
            {"$set": {"password": hashedPassword, "defaultPassword": False}},
        )

        return {
            "status": 1,
            "cls": "success",
            "msg": "Password reset email sent successfully",
            "payload": {},
        }
