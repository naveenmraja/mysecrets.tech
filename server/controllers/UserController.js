import {validateCreateOrUpdateUser, validateLoginRequest, validateLogoutRequest} from "../utils/RequestValidators.js";
import * as constants from "../utils/Constants.js";
import {createOrUpdateUser, getUserByUsername, verifyUserLogin} from "../services/UserService.js";
import {log} from "../utils/Logger.js";

async function handleCreateOrUpdateUser(req, res, command) {
    try {
        const result = await validateCreateOrUpdateUser(req, command)
        if (!result.isEmpty()) {
            return res.status(400).json({
                status: constants.STATUS_FAILURE,
                errors: result.array()
            })
        }
        const createOrUpdateUserResponse = await createOrUpdateUser(req, res, command)
        if (command === constants.CREATE_USER && createOrUpdateUserResponse.status === 200) {
            req.session.regenerate((err) => {
                if (err) next(err)
                req.session.username = req.body.username
                req.session.save(function (err) {
                    if (err) return next(err)
                    return res.status(createOrUpdateUserResponse.status).json(createOrUpdateUserResponse.response)
                })
            })
        } else {
            return res.status(createOrUpdateUserResponse.status).json(createOrUpdateUserResponse.response)
        }
    } catch (e) {
        log.error(`Error occurred in ${command} API : ${e.message}`)
        const responseBody = {status: constants.STATUS_FAILURE, error: e.message}
        return res.status(500).json(responseBody)
    }
}

export async function createUser(req, res) {
    return handleCreateOrUpdateUser(req, res, constants.CREATE_USER)
}

export async function updateUser(req, res) {
    return handleCreateOrUpdateUser(req, res, constants.UPDATE_USER)
}

export function isAuthenticated(req, res, next) {
    const username = req.params.username ? req.params.username : req.body.username
    if (username) {
        if (req.session.username && req.session.username === username) next()
    } else if (req.session.username) next()
    else return res.status(401).json({status: constants.STATUS_FAILURE, message: "Unauthenticated resource access"})
}

export async function getUser(req, res) {
    try {
        const response = await getUserByUsername(req.session.username)
        return res.status(200).json(response)
    } catch (e) {
        log.error(`Error occurred in isUserLoggedIn API : ${e.message}`)
        const responseBody = {status: constants.STATUS_FAILURE, error: e.message}
        return res.status(500).json(responseBody)
    }
}

export async function loginUser(req, res) {
    try {
        const result = await validateLoginRequest(req)
        if (!result.isEmpty()) {
            return res.status(400).json({
                status: constants.STATUS_FAILURE,
                errors: result.array()
            })
        }
        const loginResponse = await verifyUserLogin(req)
        if (loginResponse.status === 200) {
            req.session.regenerate((err) => {
                if (err) next(err)
                req.session.username = req.params.username
                req.session.save(function (err) {
                    if (err) return next(err)
                    return res.status(loginResponse.status).json(loginResponse.response)
                })
            })
        } else {
            return res.status(loginResponse.status).json(loginResponse.response)
        }
    } catch (e) {
        log.error(`Error occurred in loginUser API : ${e.message}`)
        const responseBody = {status: constants.STATUS_FAILURE, error: e.message}
        return res.status(500).json(responseBody)
    }
}

export async function logoutUser(req, res) {
    try {
        const result = await validateLogoutRequest(req)
        if (!result.isEmpty()) {
            return res.status(400).json({
                status: constants.STATUS_FAILURE,
                errors: result.array()
            })
        }
        req.session.username = null
        req.session.save(function (err) {
            if (err) next(err)
            req.session.regenerate(function (err) {
                if (err) next(err)
                return res.status(200).json({status: constants.STATUS_SUCCESS, message: "User logged out"})
            })
        })
    } catch (e) {
        log.error(`Error occurred while logging out user : ${e.message}`)
        const responseBody = {status: constants.STATUS_FAILURE, error: e.message}
        return res.status(500).json(responseBody)
    }
}