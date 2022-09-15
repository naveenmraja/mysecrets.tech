import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    createOrUpdateEntryAPI,
    deleteEntryAPI,
    fetchCalendarAPI,
    fetchCurrentMonthEntriesAPI,
    fetchUserEntryAPI
} from "./DiaryAPI";
import {CREATE_ENTRY, STATUS_SUCCESS, UPDATE_ENTRY} from "../../utils/Constants";
import {getAllowedYears, getCurrentMonth, getCurrentYear, getErrorResponse, getMonths} from "../../utils/Utils";

const initialCurrentEntry = {
    "id": "",
    "title": "",
    "date": new Date().getDate(),
    "month": new Date().getMonth(),
    "year": new Date().getFullYear(),
    "content": ""
}

const initialState = {
    currentMonthEntries: [],
    calendarEntries: {},
    currentEntry: initialCurrentEntry,
    currentEntrySaved: true,
    years: getAllowedYears(),
    months: getMonths(),
    currentYear: getCurrentYear(),
    currentMonth: getCurrentMonth(),
    retryFetchCalendar: false,
    ui: {
        showSkeleton: true,
        showSavingLoader: false,
        showLoader: false,
        errorMessage: "",
        showSnackbar: false,
        showConfirmDeleteEntry: false,
        currentEntryDeleted: false
    }
}

export const fetchCalendar = createAsyncThunk(
    'diary/calendar',
    async (username) => {
        const response = await fetchCalendarAPI(username);
        return (response.ok ? await response.json() : await getErrorResponse(response))
    }
);

export const fetchUserEntry = createAsyncThunk(
    "diary/entry",
    async (entryId, {getState}) => {
        const state = getState()
        const response = await fetchUserEntryAPI(entryId, state.user.username);
        return (response.ok ? await response.json() : await getErrorResponse(response))
    }
)

export const fetchCurrentMonthEntries = createAsyncThunk(
    "diary/monthEntries",
    async (params, {getState}) => {
        const state = getState()
        const response = await fetchCurrentMonthEntriesAPI(params, state.user.username);
        return (response.ok ? await response.json() : await getErrorResponse(response))
    }
)

export const createOrUpdateEntry = createAsyncThunk(
    "diary/createOrUpdateEntry",
    async (entry, {getState}) => {
        const state = getState()
        const username = state.user.username
        if (entry.title.length > 100) {
            return {errorMessage: "Title shouldn't exceed 100 characters"}
        } else if (entry.content) {
            const command = entry.id ? UPDATE_ENTRY : CREATE_ENTRY
            const response = await createOrUpdateEntryAPI(command, entry, username);
            return (response.ok ? await response.json() : await getErrorResponse(response))
        } else {
            return {errorMessage: "Empty Entry"}
        }
    }
)

export const deleteEntry = createAsyncThunk(
    "diary/deleteEntry",
    async (params) => {
        if (!params.entryId) {
            return {status: STATUS_SUCCESS}
        } else {
            const response = await deleteEntryAPI(params.entryId, params.username);
            return (response.ok ? await response.json() : await getErrorResponse(response))
        }
    }
)

export const diarySlice = createSlice({
    name: "diary",
    initialState,
    reducers: {
        updateCurrentEntry: (state, action) => {
            state.currentEntry = action.payload
        },
        clearCurrentEntryContent: (state) => {
            state.currentEntry.content = ""
            state.currentEntrySaved = false
        },
        updateCurrentEntryTitle: (state, action) => {
            state.currentEntry.title = action.payload
            state.currentEntrySaved = false
        },
        updateCurrentEntryContent: (state, action) => {
            state.currentEntry.content = action.payload
            state.currentEntrySaved = false
        },
        updateCurrentYear: (state, action) => {
            const year = action.payload
            const currentDate = new Date()
            state.currentYear = year
            if (year === currentDate.getFullYear()) {
                state.currentMonth = currentDate.getMonth()
            } else {
                state.currentMonth = 0
            }
        },
        updateCurrentMonth: (state, action) => {
            state.currentMonth = action.payload
        },
        resetCurrenEntry: (state) => {
            state.currentEntry = initialCurrentEntry
        },
        resetUIElements: (state) => {
            state.ui.showSavingLoader = false
            state.ui.showDeletingLoader = false
            state.ui.errorMessage = ""
            state.ui.showSnackbar = false
            state.ui.showConfirmDeleteEntry = false
            state.ui.currentEntryDeleted = false
        },
        removeDateFromCalendarEntries: (state, action) => {
            const date = action.payload
            let calendarEntries = state.calendarEntries
            delete calendarEntries[date]
            state.calendarEntries = calendarEntries
        },
        removeFromCurrentMonthEntries: (state, action) => {
            const entryId = action.payload
            let currentMonthEntries = state.currentMonthEntries
            state.currentMonthEntries = currentMonthEntries.filter((entry) => entry.id !== entryId)
        },
        hideSnackbar: (state) => {
            state.ui.showSnackbar = false
        },
        showLoader: (state) => {
            state.ui.showLoader = true
        },
        hideLoader: (state) => {
            state.ui.showLoader = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCalendar.pending, (state) => {
            state.retryFetchCalendar = false
        }).addCase(fetchCalendar.fulfilled, (state, action) => {
            const response = action.payload;
            if ("errorMessage" in response) {
                state.retryFetchCalendar = true
            } else {
                const calendarEntries = response.entries
                let entriesDates = {}
                calendarEntries.forEach((calendarEntry) => {
                    const date = new Date(calendarEntry.year, calendarEntry.month, calendarEntry.date)
                    entriesDates[date.toDateString()] = calendarEntry.id
                })
                state.retryFetchCalendar = false
                state.calendarEntries = entriesDates
            }
        }).addCase(fetchCalendar.rejected, (state) => {
            state.retryFetchCalendar = true
        }).addCase(fetchCurrentMonthEntries.pending, (state) => {
            state.ui.showSkeleton = true
            state.currentMonthEntries = []
            state.ui.errorMessage = ""
        }).addCase(fetchCurrentMonthEntries.fulfilled, (state, action) => {
            const response = action.payload
            if ("errorMessage" in response) {
                state.ui.errorMessage = response.errorMessage
            } else {
                const entries = response.entries
                entries.sort((a, b) => a.date - b.date)
                Object.assign(state.currentMonthEntries, entries)
                state.ui.errorMessage = ""
            }
            state.ui.showSkeleton = false
        }).addCase(fetchCurrentMonthEntries.rejected, (state) => {
            state.currentMonthEntries = []
            state.ui.errorMessage = "Error occurred while fetching entries"
            state.ui.showSkeleton = false
        }).addCase(createOrUpdateEntry.pending, (state) => {
            state.currentEntrySaved = false
            state.ui.showSavingLoader = true
            state.ui.showSnackbar = false
            state.ui.errorMessage = ""
        }).addCase(createOrUpdateEntry.fulfilled, (state, action) => {
            const response = action.payload
            if ("errorMessage" in response) {
                state.ui.errorMessage = response.errorMessage
                state.currentEntrySaved = false
                state.ui.showSavingLoader = false
                state.ui.showSnackbar = true
            } else {
                if (response.year === state.currentEntry.year && response.month === state.currentEntry.month
                    && response.date === state.currentEntry.date) {
                    state.currentEntry.id = response.id
                    const date = new Date(response.year, response.month, response.date)
                    let calendarEntries = state.calendarEntries
                    if (!(date.toDateString() in calendarEntries)) {
                        calendarEntries[date.toDateString()] = response.id
                    }
                    state.calendarEntries = calendarEntries
                    state.ui.showSnackbar = false
                    state.ui.showSavingLoader = false
                    state.ui.errorMessage = ""
                    state.currentEntrySaved = true
                }
            }
        }).addCase(createOrUpdateEntry.rejected, (state) => {
            state.ui.errorMessage = "Error occurred while saving"
            state.currentEntrySaved = false
            state.ui.showSavingLoader = false
            state.ui.showSnackbar = true
        }).addCase(deleteEntry.pending, (state) => {
            state.ui.currentEntryDeleted = false
            state.ui.showLoader = true
            state.ui.showSnackbar = false
            state.ui.errorMessage = ""
        }).addCase(deleteEntry.fulfilled, (state, action) => {
            const response = action.payload
            if ("errorMessage" in response) {
                state.ui.errorMessage = response.errorMessage
                state.ui.showLoader = false
                state.ui.showSnackbar = true
                state.ui.currentEntryDeleted = false
            } else {
                let currentMonthEntries = state.currentMonthEntries
                state.currentMonthEntries = currentMonthEntries.filter((entry) => entry.id !== response.entryId)
                state.ui.showSnackbar = false
                state.ui.showLoader = false
                state.ui.errorMessage = ""
                state.ui.currentEntryDeleted = true
            }
        }).addCase(deleteEntry.rejected, (state) => {
            state.ui.errorMessage = "Error occurred while deleting entry"
            state.ui.showLoader = false
            state.ui.showSnackbar = true
            state.ui.currentEntryDeleted = false
        }).addCase(fetchUserEntry.pending, (state) => {
            state.ui.showLoader = true
            state.ui.showSnackbar = false
            state.ui.errorMessage = ""
        }).addCase(fetchUserEntry.fulfilled, (state, action) => {
            const response = action.payload;
            if ("errorMessage" in response) {
                state.ui.errorMessage = response.errorMessage
                state.ui.showSnackbar = true
            } else {
                Object.assign(state.currentEntry, response)
            }
            state.ui.showLoader = false
        }).addCase(fetchUserEntry.rejected, (state) => {
            state.ui.errorMessage = "Error occurred while fetching entry"
            state.ui.showSnackbar = true
            state.ui.showLoader = false
        });
    }
})

export const {
    updateCurrentEntry, updateCurrentYear, updateCurrentMonth, updateCurrentEntryTitle,
    updateCurrentEntryContent, resetCurrenEntry, clearCurrentEntryContent, hideSnackbar,
    removeDateFromCalendarEntries, removeFromCurrentMonthEntries, showLoader, hideLoader,
    resetUIElements
} = diarySlice.actions

export default diarySlice.reducer