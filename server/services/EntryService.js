import { Entry } from '../model/Entries.js'
import * as constants from '../utils/Constants.js'
import { nanoid } from 'nanoid/async'
import { log } from '../utils/Logger.js'

export async function createOrUpdateEntry(request, response, command) {
    try {
        log.info(`${command} request from ${request.session.username}`)
        const entryId = (command === constants.UPDATE_ENTRY) ? request.body.id : (`entry_${await nanoid()}`)
        const document = {
            "id" : entryId,
            "username": request.session.username,
            "title" : request.body.title,
            "date" : request.body.date,
            "month" : request.body.month,
            "year" : request.body.year,
            "content" : request.body.content
        }
        let entry
        if(command === constants.CREATE_ENTRY) {
            entry = await Entry.create(document)
        } else if(command === constants.UPDATE_ENTRY) {
            entry = await Entry.update(document)
        }
        const responseBody = entry.toJSON()
        log.info(`${command} response : ${responseBody}`)
        return responseBody
    } catch (e) {
        log.error(`Error occurred while ${command} : ${e.message}`)
        throw e
    }
}

export async function deleteEntryForUser(entryId, username) {
    try {
        log.info(`Deleting ${entryId} for ${username}`)
        await Entry.delete(entryId)
        return {
            status : constants.STATUS_SUCCESS,
            entryId : entryId
        }
    } catch (e) {
        log.error(`Error while deleting ${entryId} for ${username} ${e.message}`)
        throw e
    }
}

export async function checkIfFieldExists(field, fieldValue) {
    try {
        log.info(`Checking if ${field} exists : ${fieldValue}`)
        const result = await Entry.query(field).eq(fieldValue).exec()
        log.info(`Does ${field} ${fieldValue} exist : ${result.count !== 0}`)
        return (result.count !== 0)
    } catch (e) {
        log.error(`Error while fetching ${field} : ${fieldValue} ${e.message}`)
        throw e
    }
}

export async function checkIfEntryExists(entryId) {
    return checkIfFieldExists("id", entryId)
}

export async function getEntryForUser(entryId, username) {
    try {
        log.info(`Fetching entry : ${entryId} for ${username}`)
        const result = await Entry.query({
            "id" : {"eq" : entryId},
            "username" : {"eq" : username}
        }).exec()
        log.info(`Entry ${entryId} for ${username} : ${result}`)
        return result.count === 1 ? result[0].toJSON() : null
    } catch (e) {
        log.error(`Error while fetching ${entryId} for ${username} ${e.message}`)
        throw e
    }
}

export async function getUserEntries(month, year, username) {
    try {
        log.info(`Fetching entries for month : ${month}, ${year} for ${username}`)
        const result = await Entry.query({
            "month" : {"eq" : month},
            "year" : {"eq" : year},
            "username" : {"eq" : username}
        }).exec()
        log.info(`Entries for month ${month}, ${year} for ${username} : ${result}`)
        const responseJson = {
            count : result.count,
            entries : result.toJSON()
        }
        return responseJson
    } catch (e) {
        log.error(`Error while fetching entries for month ${month}, ${year} for ${username} ${e.message}`)
        throw e
    }
}

export async function getUserEntryCalendar(request, response) {
    try {
        log.info(`Fetching UserEntryCalendar for ${request.session.username}`)
        const result  = await Entry.query("username").eq(request.session.username)
            .attributes(["id", "month", "year", "date"]).exec()
        log.info(`UserEntryCalendar results for ${request.session.username} : ${result}`)
        const responseJson = {
            count : result.count,
            entries : result.toJSON()
        }
        return responseJson
    } catch (e) {
        log.error(`Error occurred while getting UserEntryCalendar of ${request.session.username} : ${e.message}`)
        throw e
    }
}

export async function getUserEntryByDate(username, date, month, year) {
    try {
        log.info(`Fetching UserEntry by date ${date}-${month}-${year} for ${username}`)
        const result  = await Entry.query({
            "username" : {"eq" : username},
            "date" : {"eq" : date},
            "month" : {"eq" : month},
            "year" : {"eq" : year}
        }).exec()
        log.info(`UserEntry by date ${date}-${month}-${year} results for ${username}: ${result}`)
        return result.count === 1 ? result[0].toJSON() : null
    } catch (e) {
        log.error(`Error occurred while getting UserEntry by date ${date}-${month}-${year} for ${username} : ${e.message}`)
        throw e
    }
}

export async function checkIfEntryExistsForUser(entryId, username) {
    return (await getEntryForUser(entryId, username) !== null)
}