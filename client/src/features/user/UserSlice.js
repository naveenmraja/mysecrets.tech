import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    createUserAPI, getUserAPI,
    loginUserAPI,
    logoutUserAPI,
    updateUserAPI
} from "./UserAPI";
import {STATUS_SUCCESS} from "../../utils/Constants";
import {getErrorResponse} from "../../utils/Utils";

const initialState = {
    name : "",
    username : "",
    password : "",
    confirmPassword : "",
    newPassword : "",
    confirmNewPassword : "",
    email : "",
    diaryName: "",
    loggedIn : false,
    ui : {
        usernameError: "",
        passwordError: "",
        confirmPasswordError : "",
        emailError: "",
        diaryNameError: "",
        nameError: "",
        showLoader: false,
        signUpError : "",
        loginError : "",
        logoutError : "",
        updateUserError: "",
        showLogin : true,
        showSignup : false,
        showSnackbar : false,
        showHeader : true
    }
}

export const loginUser = createAsyncThunk(
    'users/loginUser',
    async (params) => {
        const response = await loginUserAPI(params);
        return (response.ok ? await response.json() : await getErrorResponse(response))
    }
);

export const getUser = createAsyncThunk(
    'users/getUser',
    async () => {
        const response = await getUserAPI()
        return (response.ok ? await response.json() : await getErrorResponse(response))
    }
)

export const logoutUser = createAsyncThunk(
    'users/logoutUser',
    async (username) => {
        const response =  await logoutUserAPI(username);
        return (response.ok ? await response.json() : await getErrorResponse(response))
    }
);

export const signupUser = createAsyncThunk(
    'users/signupUser',
    async ( username, { getState }) => {
        const state = getState()
        const response = (await createUserAPI(state));
        return (response.ok ? await response.json() : await getErrorResponse(response))
    }
);

export const updateUserDetails = createAsyncThunk(
    'users/updateUser',
    async (params) => {
        const response = await updateUserAPI(params);
        return (response.ok ? await response.json() : await getErrorResponse(response))
    }
);

export const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        updateName : (state, action) => {
            state.name = action.payload
        },
        updateUsername : (state, action) => {
            state.username = action.payload
        },
        updatePassword : (state, action) => {
            state.password = action.payload
        },
        updateConfirmPassword : (state, action) => {
            state.confirmPassword = action.payload
        },
        updateNewPassword : (state, action) => {
            state.newPassword = action.payload
        },
        updateConfirmNewPassword : (state, action) => {
            state.confirmNewPassword = action.payload
        },
        updateEmail : (state, action) => {
            state.email = action.payload
        },
        updateDiaryName : (state, action) => {
            state.diaryName = action.payload
        },
        showLogin : (state) => {
            state.name = ""
            state.username = ""
            state.password = ""
            state.email = ""
            state.diaryName = ""
            state.ui.showLogin = true
            state.ui.showSignup = false
        },
        showSignup : (state) => {
            state.name = ""
            state.username = ""
            state.password = ""
            state.confirmPassword = ""
            state.email = ""
            state.diaryName = ""
            state.ui.showLogin = false
            state.ui.showSignup = true
        },
        showLoader : (state) => {
            state.ui.showLoader = true
        },
        hideLoader : (state) => {
            state.ui.showLoader = false
        },
        showSnackbar : (state) => {
            state.ui.showSnackbar = false
            state.ui.showSnackbar = true
        },
        hideSnackbar : (state) => {
            state.ui.showSnackbar = false
        },
        updateNameError : (state, action) => {
            state.ui.nameError = action.payload
        },
        updateUsernameError : (state, action) => {
            state.ui.usernameError = action.payload
        },
        updatePasswordError : (state, action) => {
            state.ui.passwordError = action.payload
        },
        updateConfirmPasswordError : (state, action) => {
            state.ui.confirmPasswordError = action.payload
        },
        updateEmailError : (state, action) => {
            state.ui.emailError = action.payload
        },
        updateDiaryNameError : (state, action) => {
            state.ui.diaryNameError = action.payload
        },
        clearErrors : (state) => {
            state.ui.usernameError = ""
            state.ui.passwordError = ""
            state.ui.confirmPasswordError = ""
            state.ui.emailError = ""
            state.ui.diaryNameError = ""
            state.ui.nameError = ""
        },
        showHeader : (state) => {
            state.ui.showHeader = true
        },
        hideHeader : (state) => {
            state.ui.showHeader = false
        }
    },
    extraReducers : (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.ui.showSnackbar = false
            state.ui.showLoader = true
        }).addCase(loginUser.fulfilled, (state, action) => {
            const response = action.payload;
            if("errorMessage" in response) {
                state.ui.loginError = response.errorMessage
                state.loggedIn = false
                state.ui.showSnackbar = true
            } else {
                state.ui.loginError = ""
                Object.assign(state, response)
                state.loggedIn = true
            }
            state.ui.showLoader = false;
        }).addCase(loginUser.rejected, (state) => {
            state.ui.loginError = "Error occurred during user log in. Please try again later !"
            state.ui.showLoader = false
            state.ui.showSnackbar = true
        }).addCase(logoutUser.pending, (state) => {
            state.ui.showSnackbar = false
            state.ui.showLoader = true
        }).addCase(logoutUser.fulfilled, (state, action) => {
            const response = action.payload;
            if(response.status === STATUS_SUCCESS) {
                state.ui.logoutError = ""
                state.name = ""
                state.username = ""
                state.password = ""
                state.diaryName = ""
                state.email = ""
                state.loggedIn = false
            } else if("errorMessage" in response) {
                state.ui.logoutError = response.errorMessage
                state.loggedIn = true
                state.ui.showSnackbar = true
            }
            state.ui.showLoader = false;
        }).addCase(logoutUser.rejected, (state) => {
            state.ui.loginError = "Error occurred during user log out. Please try again later !"
            state.ui.showLoader = false
            state.ui.showSnackbar = true
        }).addCase(getUser.pending, (state) => {
            state.ui.showLoader = true
        }).addCase(getUser.fulfilled, (state, action) => {
            const response = action.payload;
            if("errorMessage" in response) {
                state.loggedIn = false
            } else {
                Object.assign(state, response)
                state.loggedIn = true
            }
            state.ui.showLoader = false
        }).addCase(getUser.rejected, (state) => {
            state.ui.showLoader = false
        }).addCase(signupUser.pending, (state) => {
            state.ui.showSnackbar = false
            state.ui.showLoader = true
        }).addCase(signupUser.fulfilled, (state, action) => {
            const response = action.payload;
            if("errorMessage" in response) {
                state.ui.signUpError = response.errorMessage
                state.loggedIn = false
                state.ui.showSnackbar = false
                state.ui.showSnackbar = true
            } else {
                state.ui.signUpError = ""
                Object.assign(state, response)
                state.loggedIn = true
            }
            state.ui.showLoader = false;
        }).addCase(signupUser.rejected, (state) => {
            state.ui.signUpError = "Error occurred during user signup. Please try again later !"
            state.ui.showLoader = false
            state.ui.showSnackbar = true
        }).addCase(updateUserDetails.pending, (state) => {
            state.ui.showSnackbar = false
            state.ui.showLoader = true
        }).addCase(updateUserDetails.fulfilled,(state, action) => {
            const response = action.payload;
            if("errorMessage" in response) {
                state.ui.updateUserError = response.errorMessage
                if(response.statusCode === 401) {
                    state.loggedIn = false
                }
            } else {
                state.ui.updateUserError = ""
                Object.assign(state, response)
            }
            state.ui.showLoader = false;
            state.ui.showSnackbar = true
        }).addCase(updateUserDetails.rejected, (state) => {
            state.ui.updateUserError = "Error occurred while updating user details. Please try again later !"
            state.ui.showLoader = false
            state.ui.showSnackbar = true
        })
    }
})

export const { updateName, updateUsername, updateEmail, updatePassword, updateConfirmPassword, updateDiaryName,
    updateNewPassword, updateConfirmNewPassword, showLogin, showSignup, clearErrors, updateNameError,
    updateUsernameError, updateEmailError, updateConfirmPasswordError, updatePasswordError, updateDiaryNameError,
    showSnackbar, hideSnackbar, showLoader, hideLoader, showHeader, hideHeader } = userSlice.actions

export default userSlice.reducer