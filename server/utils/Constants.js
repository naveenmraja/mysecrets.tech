export const NODE_ENV = "NODE_ENV"
export const PRODUCTION = "production"
export const EXPRESS_SESSION_SECRET = "EXPRESS_SESSION_SECRET"
export const DYNAMODB_SESSION_STORE = "mysecrets-sessions"
export const STATUS_FAILURE = "FAILURE"
export const STATUS_SUCCESS = "SUCCESS"
export const CREATE_USER = "create_user"
export const UPDATE_USER = "update_user"
export const CREATE_ENTRY = "create_entry"
export const UPDATE_ENTRY = "update_entry"
export const SALT_ROUNDS = 8
export const DYNAMO_DB_LOCAL_ENDPOIT = "DYNAMO_DB_LOCAL_ENDPOIT"

export function getEnvironmentVariable(name) {
    return process.env[name]
}