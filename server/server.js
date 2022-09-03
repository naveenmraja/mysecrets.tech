import express from 'express'
import { getEnvironmentVariable } from './utils/Constants.js'
import * as constants from './utils/Constants.js'
import dynamoose from  'dynamoose'
import session from 'express-session'
import connectDynamo from 'connect-dynamodb'
import { log } from './utils/Logger.js'
import {
    createUser,
    loginUser,
    updateUser,
    isAuthenticated,
    logoutUser,
    getUser
} from "./controllers/UserController.js";
import {
    createEntry,
    deleteEntry,
    getEntries,
    getEntry,
    getEntryCalendar,
    updateEntry
} from "./controllers/EntryController.js";

if(getEnvironmentVariable(constants.NODE_ENV) != constants.PRODUCTION) {
    dynamoose.aws.ddb.local(getEnvironmentVariable(constants.DYNAMO_DB_LOCAL_ENDPOIT))
}

const app = express()
var DynamoDBStore = connectDynamo({session: session})

app.use(session({
    store: new DynamoDBStore({table : constants.DYNAMODB_SESSION_STORE, client : dynamoose.aws.ddb()}),
    secret: getEnvironmentVariable(constants.EXPRESS_SESSION_SECRET),
    resave: false,
    saveUninitialized: true
}))
app.use(express.json())
app.use((err, req, res, next) => {
    log.error(err.stack)
    return res.status(500).json(err.statusMessage)
})

app.post('/users', createUser)
app.put('/users', isAuthenticated, updateUser)
app.get('/user', isAuthenticated, getUser)
app.post('/users/:username/login', loginUser)
app.get('/users/:username/logout', isAuthenticated, logoutUser)

app.get('/users/:username/entries/:entryId', isAuthenticated, getEntry)
app.get('/users/:username/entries', isAuthenticated, getEntries)
app.post('/users/:username/entries', isAuthenticated, createEntry)
app.put('/users/:username/entries', isAuthenticated, updateEntry)
app.delete('/users/:username/entries/:entryId', isAuthenticated, deleteEntry)
app.get("/users/:username/calendar", isAuthenticated, getEntryCalendar)

app.get('/health', (req, res) => {
    res.status(200).send('OK')
})

app.listen(8080, () => {
    log.info("Listening on port 8080")
})