import * as React from 'react';
import {Component} from "react";
import {connect} from "react-redux";
import Loader from "../../components/Loader";
import { Navigate } from "react-router-dom";
import {
    clearErrors,
    getUser, hideSnackbar, updateConfirmNewPassword, updateConfirmPasswordError,
    updateDiaryName, updateDiaryNameError,
    updateEmail, updateEmailError,
    updateName, updateNameError, updateNewPassword, updatePasswordError, updateUserDetails
} from "./UserSlice";
import {Button, Container, IconButton, InputAdornment, Snackbar, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {
    EmailOutlined, KeyOutlined, NoteAltOutlined,
    PersonOutlined,
    SettingsOutlined, VisibilityOffOutlined,
    VisibilityOutlined
} from "@mui/icons-material";
import * as Constants from "../../utils/Constants";
import isStrongPassword from "validator/es/lib/isStrongPassword";
import isEmail from "validator/es/lib/isEmail";
import isAlpha from "validator/es/lib/isAlpha";
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function mapStateToProps(state) {
    return {
        user : state.user,
        ui : state.user.ui
    }
}

class SettingsView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showPassword : false
        }
    }

    componentDidMount() {
        this.props.dispatch(getUser())
        this.props.dispatch(updateNewPassword(""))
        this.props.dispatch(updateConfirmNewPassword(""))
    }

    handleUpdateUser = (event) => {
        event.preventDefault()
        this.props.dispatch(clearErrors())
        if(this.props.user.newPassword && !isStrongPassword(this.props.user.newPassword)) {
            this.props.dispatch(updatePasswordError(Constants.INVALID_PASSWORD))
        } else if(this.props.user.newPassword !== this.props.user.confirmNewPassword) {
            this.props.dispatch(updateConfirmPasswordError(Constants.CONFIRM_PASSWORD_ERROR))
        } else if(!isEmail(this.props.user.email)) {
            this.props.dispatch(updateEmailError(Constants.INVALID_EMAIL))
        } else if(this.props.user.name.length < 1 || !isAlpha(this.props.user.name, 'en-US', {ignore: '\s'})) {
            this.props.dispatch(updateNameError(Constants.INVALID_NAME))
        } else if(this.props.user.diaryName.length < 1) {
            this.props.dispatch(updateDiaryNameError(Constants.INVALID_DIARY_NAME))
        } else {
            this.props.dispatch(clearErrors())
            let params = {
                username : this.props.user.username,
                email : this.props.user.email,
                name : this.props.user.name,
                diaryName : this.props.user.diaryName
            }
            if(this.props.user.newPassword) {
                params["password"] = this.props.user.newPassword
            }
            this.props.dispatch(updateUserDetails(params))
        }
    }

    componentWillUnmount() {
        this.closeSnackbar()
    }

    closeSnackbar = () => {
        this.props.dispatch(hideSnackbar())
    }

    render() {
        if(!this.props.user.loggedIn) {
            return (<Navigate to={"/"}/>)
        } else {
            return(
                <Container component="main" maxWidth="xs">
                    <Snackbar open={this.props.ui.showSnackbar} autoHideDuration={5000} onClose={this.closeSnackbar}>
                        {this.props.ui.updateUserError ? (
                            <Alert onClose={this.closeSnackbar} severity="error" sx={{ width: '100%' }}>
                                {this.props.ui.updateUserError}
                            </Alert>
                        ) : (
                            <Alert onClose={this.closeSnackbar} severity="success" sx={{ width: '100%' }}>
                                Profile updated successfully !
                            </Alert>
                        )}
                    </Snackbar>
                    <Box
                        sx={{
                            marginTop: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <SettingsOutlined />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Update Profile
                        </Typography>
                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Username"
                                autoFocus
                                size={"small"}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlined color={"primary"} />
                                        </InputAdornment>
                                    )
                                }}
                                value={this.props.user.username}
                                disabled
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="New Password"
                                type={this.state.showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                size={"small"}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <KeyOutlined color={"primary"} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {this.state.showPassword ? (
                                                <IconButton onClick={() => this.setState({ showPassword: false })}>
                                                    <VisibilityOffOutlined color={"primary"} />
                                                </IconButton>
                                            ) : (
                                                <IconButton onClick={() => this.setState({ showPassword: true })}>
                                                    <VisibilityOutlined color={"primary"} />
                                                </IconButton>
                                            )}
                                        </InputAdornment>
                                    )
                                }}
                                placeholder={"Password"}
                                value={this.props.user.newPassword}
                                error={this.props.ui.passwordError.length > 0}
                                helperText={this.props.ui.passwordError}
                                onChange={(event) => this.props.dispatch(updateNewPassword(event.target.value))}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Confirm New Password"
                                type={this.state.showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                size={"small"}
                                placeholder={"Password"}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <KeyOutlined color={"primary"} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {this.state.showPassword ? (
                                                <IconButton onClick={() => this.setState({ showPassword: false })}>
                                                    <VisibilityOffOutlined color={"primary"} />
                                                </IconButton>
                                            ) : (
                                                <IconButton onClick={() => this.setState({ showPassword: true })}>
                                                <VisibilityOutlined color={"primary"} />
                                                </IconButton>
                                            )}
                                        </InputAdornment>
                                    )
                                }}
                                value={this.props.user.confirmNewPassword}
                                error={this.props.ui.confirmPasswordError.length > 0}
                                helperText={this.props.ui.confirmPasswordError}
                                onChange={(event) => this.props.dispatch(updateConfirmNewPassword(event.target.value))}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Email"
                                autoComplete="email"
                                size={"small"}
                                placeholder={"Email"}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailOutlined color={"primary"} />
                                        </InputAdornment>
                                    )
                                }}
                                value={this.props.user.email}
                                error={this.props.ui.emailError.length > 0}
                                helperText={this.props.ui.emailError}
                                onChange={(event) => this.props.dispatch(updateEmail(event.target.value))}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Full name"
                                autoComplete="name"
                                size={"small"}
                                placeholder={"Full Name"}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlined color={"primary"} />
                                        </InputAdornment>
                                    )
                                }}
                                value={this.props.user.name}
                                error={this.props.ui.nameError.length > 0}
                                helperText={this.props.ui.nameError}
                                onChange={(event) => this.props.dispatch(updateName(event.target.value))}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Diary name"
                                size={"small"}
                                placeholder={"Diary Name"}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <NoteAltOutlined color={"primary"} />
                                        </InputAdornment>
                                    )
                                }}
                                value={this.props.user.diaryName}
                                error={this.props.ui.diaryNameError.length > 0}
                                helperText={this.props.ui.diaryNameError}
                                onChange={(event) => this.props.dispatch(updateDiaryName(event.target.value))}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={this.handleUpdateUser} //TODO : Add current password validation before updating the profile
                            >
                                Update
                            </Button>
                        </Box>
                    </Box>
                    <Loader showLoader={this.props.ui.showLoader}/>
                </Container>
            )
        }
    }
}

export default connect(mapStateToProps)(SettingsView)