import {
    CREATE_ENTRY,
    CREATE_OR_UPDATE_ENTRIES_URL,
    DELETE_ENTRY_URL,
    GET_ENTRIES_URL,
    GET_ENTRY_FOR_USER_URL,
    GET_USER_CALENDAR_URL,
} from "../../utils/Constants";

export function fetchCalendarAPI(username) {
    return fetch(GET_USER_CALENDAR_URL.replace(":username", username))
}

export function fetchUserEntryAPI(entryId, username) {
    return fetch(GET_ENTRY_FOR_USER_URL.replace(":username", username)
        .replace(":entryId", entryId))
}

export function fetchCurrentMonthEntriesAPI(params, username) {
    return fetch(GET_ENTRIES_URL.replace(":username", username) + "?" + new URLSearchParams(params))
}

export function createOrUpdateEntryAPI(command, params, username) {
    const method = (command === CREATE_ENTRY) ? "POST" : "PUT"
    return fetch(CREATE_OR_UPDATE_ENTRIES_URL.replace(":username", username), {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
}

export function deleteEntryAPI(entryId, username) {
    const url = DELETE_ENTRY_URL.replace(":username", username)
        .replace(":entryId", entryId)
    return fetch(url, {method: "DELETE"})
}