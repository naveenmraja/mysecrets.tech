import {
    CREATE_USER_URL, GET_USER_URL,
    LOGIN_USER_URL,
    UPDATE_USER_URL,
    USER_LOGOUT_URL
} from "../../utils/Constants";

export function logoutUserAPI(username) {
    return fetch(USER_LOGOUT_URL.replace(":username", username))
}

export function getUserAPI() {
    return fetch(GET_USER_URL)
}

export function loginUserAPI(params) {
    return fetch(LOGIN_USER_URL.replace(":username", params.username), {
        method : "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
}

export function createUserAPI(state) {
    return fetch(CREATE_USER_URL, {
        method : "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username : state.user.username,
            password : state.user.password,
            email : state.user.email,
            diaryName : state.user.diaryName,
            name : state.user.name
        })
    })
}

export function updateUserAPI(params) {
    return fetch(UPDATE_USER_URL, {
        method : "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
}