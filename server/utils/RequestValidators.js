import {check, validationResult} from "express-validator"
import {
    checkIfEmailExists,
    checkIfEmailRegisteredWithDifferentUser,
    checkIfUsernameExists
} from "../services/UserService.js"
import * as constants from './Constants.js'
import {checkIfEntryExists, checkIfEntryExistsForUser, getUserEntryByDate} from '../services/EntryService.js'

export async function validateGetUserEntryCalendar(req) {
    await check('username').exists().notEmpty().withMessage("Username not present")
        .custom(async (username) => {
            const doesExist = await checkIfUsernameExists(username)
            return doesExist ? true : await Promise.reject("Invalid username")
        }).withMessage("Invalid username").run(req)
    return validationResult(req)
}

export async function validateGetEntries(req) {
    await check('month').exists().notEmpty().withMessage("Month not available").isInt({ min: 0, max: 11 })
        .withMessage('Invalid date').run(req)
    await check('year').exists().notEmpty().withMessage("Year not available")
        .isInt({ min: 2000, max: new Date().getFullYear() })
        .withMessage('Invalid year').run(req)
    return validationResult(req)
}

export async function validateCreateOrUpdateEntry(req, command) {
    const titleCheck = await check('title').isLength({max : 100})
        .withMessage('Title exceeding 100 characters').run(req, {dryRun: true})
    const entryCheck = await check('content').notEmpty().withMessage('Empty content')
        .isLength({max : 5000}).withMessage("Entry content exceeding 5000 characters").run(req, {dryRun: true})
    const dateCheck = await check('date').isInt({ min: 1, max: 31 }).withMessage('Invalid date').run(req, {dryRun: true})
    const monthCheck = await check('month').isInt({ min: 0, max: 11 }).withMessage('Invalid month').run(req, {dryRun: true})
    if(titleCheck.isEmpty() && entryCheck.isEmpty() && dateCheck.isEmpty() && monthCheck.isEmpty()) {
        await check('year').isInt({ min: 1990, max: new Date().getFullYear() }).withMessage('Invalid year')
            .bail().custom(async (year, {req}) => {
                let daysInMonth = new Date(year, req.body.month, 0).getDate()
                return (req.body.date > daysInMonth) ? await Promise.reject("Invalid date") : true
            }).withMessage("Invalid date").bail().custom(async (year, {req}) => {
                if(command === constants.CREATE_ENTRY) {
                    const result = await getUserEntryByDate(req.session.username, req.body.date,
                        req.body.month, year)
                    return result ? await Promise.reject(`Entry ${result.entryId} already exists for given date`) : true
                } else {
                    return true
                }
            }).run(req)
        if(command === constants.UPDATE_ENTRY) {
            await check('id').notEmpty().withMessage("Empty entryId").exists().withMessage("Entry Id unavailable")
                .bail().custom(async (entryId) => {
                    const doesExist = await checkIfEntryExists(entryId)
                    return doesExist ? true : await Promise.reject("Entry does not exist")
                }).withMessage("Entry does not exist").run(req)
        }
        return validationResult(req)
    } else {
        if(!titleCheck.isEmpty()) return titleCheck
        if(!entryCheck.isEmpty()) return entryCheck
        if(!dateCheck.isEmpty()) return dateCheck
        if(!monthCheck.isEmpty()) return monthCheck
    }
}

export async function validateGetOrDeleteEntryForUser(req) {
    await check('entryId').exists().notEmpty().withMessage("EntryId not available").bail()
        .custom(async (entryId, {req}) => {
            const doesExist = await checkIfEntryExistsForUser(entryId, req.session.username)
            return doesExist ? true : await Promise.reject("Invalid entryId")
        }).withMessage("Invalid entryId").run(req)
    return validationResult(req)
}

export async function validateLoginRequest(req) {
    await check('password').exists().withMessage("Password not present")
        .isStrongPassword().withMessage("Invalid username/password").run(req)
    await check('username').exists().notEmpty().withMessage("Username not present")
        .isLength({min: 6}).withMessage("Invalid username/password").bail()
        .custom(async (username, {req}) => {
            if(req.body.username !== req.params.username) {
                return await Promise.reject("Username mismatch in URL and request body")
            } else {
                const doesExist = await checkIfUsernameExists(username)
                return doesExist ? true : await Promise.reject("Invalid username/password")
            }
        }).withMessage("Invalid username/password").run(req)
    return validationResult(req)
}

export async function validateLogoutRequest(req) {
    await check('username').exists().notEmpty().withMessage("Username not present")
        .isLength({min: 6}).withMessage("Invalid username").bail()
        .custom(async (username) => {
            const doesExist = await checkIfUsernameExists(username)
            return doesExist ? true : await Promise.reject("Invalid username/password")
        }).withMessage("Invalid username/password").run(req)
    return validationResult(req)
}

export async function validateCreateOrUpdateUser(req, command) {

    let usernameExistenceMessage
    if(command === constants.CREATE_USER) {
        usernameExistenceMessage = "Username already exists"
    } else  if(command === constants.UPDATE_USER) {
        usernameExistenceMessage = "Username does not exist"
    }

    await check('name').exists().withMessage("Name not present")
        .notEmpty().withMessage("Name not present").isAlpha('en-US', {ignore: '\s'}).withMessage("Invalid Name").run(req)
    await check('diaryName').isLength({max : 100})
        .withMessage("Diary name shouldn't exceed 100 characters").run(req)

    if(command === constants.CREATE_USER) {
        await check('password').exists().withMessage("Password not present")
            .isStrongPassword().withMessage("Password policy mismatch").run(req)
    } else if(command === constants.UPDATE_USER && req.body.password) {
        await check('password').isStrongPassword().withMessage("Password policy mismatch").run(req)
    }

    const usernameCheck = await check('username').exists().notEmpty().withMessage("Username not present")
        .isLength({min: 6}).withMessage("Username must be atleast 6 characters in length").bail()
        .custom(async (username) => {
            const doesExist = await checkIfUsernameExists(username)
            if(command === constants.CREATE_USER) {
                return doesExist ? await Promise.reject("Username already exists") : true
            } else if(command === constants.UPDATE_USER) {
                return doesExist ? true : await Promise.reject("Username does not exist")
            }
        }).withMessage(usernameExistenceMessage).run(req, {dryRun: true})

    if(usernameCheck.isEmpty()) {
        await check('email').exists().withMessage("Email  not present")
            .isEmail().withMessage("Invalid Email").bail().normalizeEmail()
            .custom(async(email, {req}) =>  {
                if(command === constants.CREATE_USER) {
                    const doesExist = await checkIfEmailExists(email)
                    doesExist ? await Promise.reject("Email already registered with another user") : true
                } else if(command === constants.UPDATE_USER) {
                    const username = req.session.username
                    const taken = await checkIfEmailRegisteredWithDifferentUser(email, username)
                    taken ? await Promise.reject("Email already registered with another user") : true
                }
            }).withMessage("Email already registered with another user").run(req)
    } else {
        return usernameCheck
    }
    return validationResult(req)
}