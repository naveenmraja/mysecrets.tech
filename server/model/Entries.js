import * as dynamoose from  "dynamoose"
import {getEnvironmentVariable, NODE_ENV, PRODUCTION} from "../utils/Constants.js";

const environment = getEnvironmentVariable(NODE_ENV)

const entrySchema = new dynamoose.Schema({
    "id" : String,
    "username": {
        "type": String,
        "index": {
            "name": "usernameIndex",
            "global": true
        }
    },
    "title" : String,
    "date" : {
        "type": Number,
        "index": {
            "name": "dateIndex",
            "global": true
        }
    },
    "month" : {
        "type": Number,
        "index": {
            "name": "monthIndex",
            "global": true
        }
    },
    "year" : {
        "type": Number,
        "index": {
            "name": "yearIndex",
            "global": true
        }
    },
    "content" : String
}, {timestamps: true})

export const Entry = dynamoose.model("entries", entrySchema, {create: (environment !== PRODUCTION)})