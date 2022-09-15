import * as React from 'react';
import {Component} from 'react';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {connect} from "react-redux";
import {Button, Container, IconButton, InputAdornment, Snackbar, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import {
    clearErrors,
    hideLoader,
    hideSnackbar,
    showLogin,
    signupUser,
    updateConfirmPassword,
    updateConfirmPasswordError,
    updateDiaryName,
    updateDiaryNameError,
    updateEmail,
    updateEmailError,
    updateName,
    updateNameError,
    updatePassword,
    updatePasswordError,
    updateUsername,
    updateUsernameError
} from "./UserSlice";
import Link from '@mui/material/Link';
import isAlphanumeric from "validator/es/lib/isAlphanumeric";
import * as Constants from "../../utils/Constants";
import isStrongPassword from "validator/es/lib/isStrongPassword";
import isEmail from "validator/es/lib/isEmail";
import isAlpha from "validator/es/lib/isAlpha";
import {
    EmailOutlined,
    KeyOutlined,
    NoteAltOutlined,
    PersonOutlined,
    VisibilityOffOutlined,
    VisibilityOutlined
} from "@mui/icons-material";
import MuiAlert from "@mui/material/Alert";
import Loader from "../../components/Loader";

function mapStateToProps(state) {
    return {
        user: state.user,
        ui: state.user.ui
    }
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class SignUpView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            showForgotPasswordSnackbar: false
        }
    }

    handleSignUp = (event) => {
        event.preventDefault()
        this.props.dispatch(hideSnackbar())
        this.props.dispatch(clearErrors())
        if (this.props.user.username.length < 6 || !isAlphanumeric(this.props.user.username)) {
            this.props.dispatch(updateUsernameError(Constants.INVALID_USERNAME))
        } else if (!isStrongPassword(this.props.user.password)) {
            this.props.dispatch(updatePasswordError(Constants.INVALID_PASSWORD))
        } else if (this.props.user.password !== this.props.user.confirmPassword) {
            this.props.dispatch(updateConfirmPasswordError(Constants.CONFIRM_PASSWORD_ERROR))
        } else if (!isEmail(this.props.user.email)) {
            this.props.dispatch(updateEmailError(Constants.INVALID_EMAIL))
        } else if (this.props.user.name.length < 1 || !isAlpha(this.props.user.name, 'en-US', {ignore: '\s'})) {
            this.props.dispatch(updateNameError(Constants.INVALID_NAME))
        } else if (this.props.user.diaryName.length < 1) {
            this.props.dispatch(updateDiaryNameError(Constants.INVALID_DIARY_NAME))
        } else {
            this.props.dispatch(clearErrors())
            this.props.dispatch(signupUser())
        }
    }

    closeSnackbar = () => {
        this.props.dispatch(hideSnackbar())
    }

    render() {
        return (
            <Container component="main" maxWidth="xs">
                <Snackbar open={this.props.ui.showSnackbar} autoHideDuration={5000} onClose={this.closeSnackbar}>
                    <Alert onClose={this.closeSnackbar} severity="error" sx={{width: '100%'}}>
                        {this.props.ui.signUpError}
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.showForgotPasswordSnackbar} autoHideDuration={5000}
                          onClose={() => this.setState({showForgotPasswordSnackbar: false})}>
                    <Alert onClose={() => this.setState({showForgotPasswordSnackbar: false})} severity="error"
                           sx={{width: '100%'}}>
                        Forgot Password feature unavailable at this moment
                    </Alert>
                </Snackbar>
                <Box
                    sx={{
                        marginTop: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Username"
                            autoComplete="username"
                            autoFocus
                            size={"small"}
                            placeholder={"Username"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutlined color={"primary"}/>
                                    </InputAdornment>
                                )
                            }}
                            value={this.props.user.username}
                            error={this.props.ui.usernameError.length > 0}
                            helperText={this.props.ui.usernameError}
                            onChange={(event) => this.props.dispatch(updateUsername(event.target.value))}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type={this.state.showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            size={"small"}
                            placeholder={"Password"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <KeyOutlined color={"primary"}/>
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {this.state.showPassword ? (
                                            <IconButton onClick={() => this.setState({showPassword: false})}>
                                                <VisibilityOffOutlined/>
                                            </IconButton>
                                        ) : (
                                            <IconButton onClick={() => this.setState({showPassword: true})}>
                                                <VisibilityOutlined/>
                                            </IconButton>
                                        )}
                                    </InputAdornment>
                                )
                            }}
                            value={this.props.user.password}
                            error={this.props.ui.passwordError.length > 0}
                            helperText={this.props.ui.passwordError}
                            onChange={(event) => this.props.dispatch(updatePassword(event.target.value))}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Confirm Password"
                            type={this.state.showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            size={"small"}
                            placeholder={"Confirm Password"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <KeyOutlined color={"primary"}/>
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {this.state.showPassword ? (
                                            <IconButton onClick={() => this.setState({showPassword: false})}>
                                                <VisibilityOffOutlined/>
                                            </IconButton>
                                        ) : (
                                            <IconButton onClick={() => this.setState({showPassword: true})}>
                                                <VisibilityOutlined/>
                                            </IconButton>
                                        )}
                                    </InputAdornment>
                                )
                            }}
                            value={this.props.user.confirmPassword}
                            error={this.props.ui.confirmPasswordError.length > 0}
                            helperText={this.props.ui.confirmPasswordError}
                            onChange={(event) => this.props.dispatch(updateConfirmPassword(event.target.value))}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            autoComplete="email"
                            size={"small"}
                            placeholder={"Email"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlined color={"primary"}/>
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
                            required
                            fullWidth
                            label="Full name"
                            autoComplete="name"
                            size={"small"}
                            placeholder={"Full Name"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutlined color={"primary"}/>
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
                            required
                            fullWidth
                            label="Diary name"
                            size={"small"}
                            placeholder={"Diary Name"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <NoteAltOutlined color={"primary"}/>
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
                            sx={{mt: 3, mb: 2}}
                            onClick={this.handleSignUp}
                        >
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link variant="body1"
                                      sx={{cursor: "pointer"}} // TODO : Implement Forgot Password
                                      onClick={() => {
                                          this.setState({showForgotPasswordSnackbar: true})
                                      }}>
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link variant="body1"
                                      sx={{cursor: "pointer"}}
                                      onClick={() => {
                                          this.props.dispatch(hideSnackbar())
                                          this.props.dispatch(hideLoader())
                                          this.props.dispatch(clearErrors())
                                          this.props.dispatch(showLogin())
                                      }}>
                                    {"Already have an account? Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Loader showLoader={this.props.ui.showLoader}/>
            </Container>
        )
    }
}

export default connect(mapStateToProps)(SignUpView)