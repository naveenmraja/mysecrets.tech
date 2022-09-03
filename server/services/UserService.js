import { User } from '../model/User.js'
import * as constants from '../utils/Constants.js'
import * as bcrypt from 'bcrypt'
import { log } from '../utils/Logger.js'

export async function verifyUserLogin(request) {
    try {
        log.info(`User login verification for : ${request.params.username}`)
        const user = await User.get(request.params.username)
        const passwordHash = user.password
        const result = await bcrypt.compare(request.body.password, passwordHash)
        if(result) {
            const responseBody = await user.json()
            log.info(`User login verified : ${responseBody}`)
            return {"status" : 200, "response" : responseBody}
        } else {
            log.info(`User login failed : ${request.params.username}`)
            const responseBody = {status : constants.STATUS_FAILURE, error: "Invalid username/password"}
            return {"status" : 400, "response" : responseBody}
        }
    } catch (e) {
        log.error(`Error occurred while verifying user login ${request.params.username} : ${e.message}`)
        const responseBody = {status : constants.STATUS_FAILURE, error: e.message}
        return {"status" : 500, "response" : responseBody}
    }
}

export async function createOrUpdateUser(request, response, command) {
    try {
        log.info(`${command} request for : ${request.body.username}`)
        let document = {
            "username": (command === constants.CREATE_USER ? request.body.username : request.session.username),
            "name" : request.body.name,
            "email" : request.body.email,
            "diaryName" : request.body.diaryName
        }
        if(request.body.password) {
            document["password"] = await bcrypt.hash(request.body.password, constants.SALT_ROUNDS)
        }
        let user
        if(command === constants.CREATE_USER) {
            user = await User.create(document)
        } else if(command === constants.UPDATE_USER) {
            user = await User.update(document)
        }
        const responseBody = await user.json()
        log.info(`${command} response : ${responseBody}`)
        return {"status" : 200, "response" : responseBody}
    } catch (e) {
        log.error(`Error occurred during ${command} : ${e.message}`)
        const responseBody = {status : constants.STATUS_FAILURE, error: e.message}
        return {"status" : 500, "response" : responseBody}
    }
}

export async function getUserByUsername(username) {
    try {
        log.info(`Getting user ${username}`)
        const result = await User.get(username)
        const responseBody = await result.json()
        log.info(`User ${username} response : ${responseBody}`)
        return responseBody
    } catch (e) {
        log.error(`Error while fetching User ${username} : ${e.message}`)
        throw e
    }
}

export async function checkIfFieldExists(field, fieldValue) {
    try {
        log.info(`Checking if ${field} exists : ${fieldValue}`)
        const result = await User.query(field).eq(fieldValue).exec()
        log.info(`Does ${field} ${fieldValue} exist : ${result.count !== 0}`)
        return (result.count !== 0)
    } catch (e) {
        log.error(`Error while fetching ${field} : ${fieldValue} ${e.message}`)
        throw e
    }
}

export async function checkIfEmailRegisteredWithDifferentUser(email, username) {
    try {
        log.info(`Checking if ${email} registered with different User from : ${username}`)
        const result = await User.query("email").eq(email).and().where("username").not().eq(username).exec()
        log.info(`Is ${email} registered with different user from ${username} : ${result.count !== 0}`)
        return (result.count !== 0)
    } catch (e) {
        log.error(`Error while checking if email ${email} registered with different User from : ${username} ${e.message}`)
        throw e
    }
}

export async function checkIfUsernameExists(username) {
    return checkIfFieldExists("username", username)
}

export async function checkIfEmailExists(email) {
    return checkIfFieldExists("email", email)
}
