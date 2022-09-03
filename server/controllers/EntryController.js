import {
    validateCreateOrUpdateEntry, validateGetEntries,
    validateGetOrDeleteEntryForUser,
    validateGetUserEntryCalendar
} from "../utils/RequestValidators.js";
import * as constants from "../utils/Constants.js";
import {
    createOrUpdateEntry,
    deleteEntryForUser,
    getEntryForUser, getUserEntries,
    getUserEntryCalendar
} from "../services/EntryService.js";
import {log} from "../utils/Logger.js";

async function handleCreateOrUpdateEntry(req, res, command) {
    try {
        const result = await validateCreateOrUpdateEntry(req, command)
        if(!result.isEmpty()) {
            return res.status(400).json({
                status : constants.STATUS_FAILURE,
                errors: result.array()
            })
        }
        const response = await createOrUpdateEntry(req, res, command)
        return res.status(200).json(response)
    } catch (e) {
        log.error(`Error occurred in ${command} API : ${e.message}`)
        const responseBody = {status : constants.STATUS_FAILURE, error: e.message}
        return res.status(500).json(responseBody)
    }
}

export async function createEntry(req, res) {
    return handleCreateOrUpdateEntry(req, res, constants.CREATE_ENTRY)
}

export async function updateEntry(req, res) {
    return handleCreateOrUpdateEntry(req, res, constants.UPDATE_ENTRY)
}

export async function getEntry(req, res) {
    try {
        const result = await validateGetOrDeleteEntryForUser(req)
        if(!result.isEmpty()) {
            return res.status(400).json({
                status : constants.STATUS_FAILURE,
                errors: result.array()
            })
        }
        const response = await getEntryForUser(req.params.entryId, req.session.username)
        return res.status(200).json(response)
    } catch (e) {
        log.error(`Error occurred in getEntry API : ${e.message}`)
        const responseBody = {status : constants.STATUS_FAILURE, error: e.message}
        return res.status(500).json(responseBody)
    }
}

export async function getEntries(req, res) {
    try {
        const result = await validateGetEntries(req)
        if(!result.isEmpty()) {
            return res.status(400).json({
                status : constants.STATUS_FAILURE,
                errors: result.array()
            })
        }
        const response = await getUserEntries(Number(req.query.month), Number(req.query.year),
            req.session.username)
        return res.status(200).json(response)
    } catch (e) {
        log.error(`Error occurred in getEntries API : ${e.message}`)
        const responseBody = {status : constants.STATUS_FAILURE, error: e.message}
        return res.status(500).json(responseBody)
    }
}

export async function deleteEntry(req, res) {
    try {
        const result = await validateGetOrDeleteEntryForUser(req)
        if(!result.isEmpty()){
            return res.status(400).json({
                status : constants.STATUS_FAILURE,
                errors: result.array()
            })
        }
        const response = await deleteEntryForUser(req.params.entryId, req.session.username)
        return res.status(200).json(response)
    } catch (e) {
        log.error(`Error occurred in getEntryCalendar API : ${e.message}`)
        const responseBody = {status : constants.STATUS_FAILURE, error: e.message}
        return res.status(500).json(responseBody)
    }
}

export async function getEntryCalendar(req, res) {
    try {
        const result = await validateGetUserEntryCalendar(req)
        if(!result.isEmpty()){
            return res.status(400).json({
                status : constants.STATUS_FAILURE,
                errors: result.array()
            })
        }
        const response = await getUserEntryCalendar(req, res)
        return res.status(200).json(response)
    } catch (e) {
        log.error(`Error occurred in getEntryCalendar API : ${e.message}`)
        const responseBody = {status : constants.STATUS_FAILURE, error: e.message}
        return res.status(500).json(responseBody)
    }
}