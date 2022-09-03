import * as dynamoose from  "dynamoose"
import {getEnvironmentVariable, NODE_ENV, PRODUCTION} from "../utils/Constants.js";

const environment = getEnvironmentVariable(NODE_ENV)

const userSchema = new dynamoose.Schema({
    "username": String,
    "password" : String,
    "name" : String,
    "email" : {
        "type": String,
        "index": {
            "name": "emailIndex",
            "global": true
        }
    },
    "diaryName" : String
}, {timestamps: true})

export const User = dynamoose.model("users", userSchema, {create: (environment !== PRODUCTION)})

User.methods.document.set("json", async function() {
    return {
        "username" : this.username,
        "name" : this.name,
        "email" : this.email,
        "diaryName" : this.diaryName,
        "createdAt" : this.createdAt,
        "updatedAt" : this.updatedAt
    }
})