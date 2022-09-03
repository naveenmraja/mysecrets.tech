import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {Component} from "react";
import {connect} from "react-redux";
import {
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Snackbar,
    TextField
} from "@mui/material";
import Box from "@mui/material/Box";
import Link from '@mui/material/Link';
import {
    clearErrors, hideLoader, hideSnackbar,
    loginUser,
    showSignup,
    updatePassword, updatePasswordError,
    updateUsername,
    updateUsernameError
} from "./UserSlice";
import * as Constants from "../../utils/Constants"
import isAlphanumeric from "validator/es/lib/isAlphanumeric";
import isStrongPassword from "validator/es/lib/isStrongPassword";
import {KeyOutlined, PersonOutlined, VisibilityOffOutlined, VisibilityOutlined} from "@mui/icons-material";
import MuiAlert from "@mui/material/Alert";
import Loader from "../../components/Loader";

function mapStateToProps(state) {
    return {
        user : state.user,
        ui : state.user.ui
    }
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class LogInView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showPassword : false,
            showForgotPasswordSnackbar : false
        }
    }

    handleLogIn = (event) => {
        event.preventDefault()
        this.props.dispatch(clearErrors())
        if(this.props.user.username.length < 6 || !isAlphanumeric(this.props.user.username)) {
            this.props.dispatch(updateUsernameError(Constants.INVALID_USERNAME))
        } else if(!isStrongPassword(this.props.user.password)) {
            this.props.dispatch(updatePasswordError(Constants.INVALID_PASSWORD))
        } else {
            const params = {
                username : this.props.user.username,
                password : this.props.user.password
            }
            this.props.dispatch(loginUser(params))
        }
    }

    closeSnackbar = () => {
        this.props.dispatch(hideSnackbar())
    }

    render() {
        return(
            <Container component="main" maxWidth="xs">
                <Snackbar open={this.props.ui.showSnackbar} autoHideDuration={5000} onClose={this.closeSnackbar}>
                    <Alert onClose={this.closeSnackbar} severity="error" sx={{ width: '100%' }}>
                        {this.props.ui.loginError}
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.showForgotPasswordSnackbar} autoHideDuration={5000} onClose={() => this.setState({showForgotPasswordSnackbar : false})}>
                    <Alert onClose={() => this.setState({showForgotPasswordSnackbar : false})} severity="error" sx={{ width: '100%' }}>
                        Forgot Password feature unavailable at this moment
                    </Alert>
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
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Username"
                            autoComplete="username"
                            autoFocus
                            placeholder={"Username"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutlined color={"primary"} />
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
                            error={this.props.ui.passwordError.length > 0}
                            helperText={this.props.ui.passwordError}
                            autoComplete="current-password"
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
                                                <VisibilityOffOutlined />
                                            </IconButton>
                                        ) : (
                                            <IconButton onClick={() => this.setState({ showPassword: true })}>
                                                <VisibilityOutlined />
                                            </IconButton>
                                        )}
                                    </InputAdornment>
                                )
                            }}
                            onChange={(event) => this.props.dispatch(updatePassword(event.target.value))}
                            placeholder={"Password"}
                            value={this.props.user.password}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={this.handleLogIn}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link variant="body1"
                                      sx={{cursor: "pointer"}} // TODO : Implement Forgot Password
                                      onClick={() => {
                                          this.setState({showForgotPasswordSnackbar : true})
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
                                          this.props.dispatch(showSignup())
                                      }}>
                                    {"Don't have an account? Sign Up"}
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

export default connect(mapStateToProps)(LogInView)