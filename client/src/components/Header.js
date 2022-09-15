import * as React from "react";
import {Component} from "react";
import {
    AppBar,
    Button,
    Divider,
    Grid,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    Toolbar
} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import {HomeOutlined, LogoutOutlined, PersonOutlined, SettingsOutlined} from "@mui/icons-material";
import {connect} from "react-redux";
import {logoutUser} from "../features/user/UserSlice";


function mapStateToProps(state) {
    return {
        user: state.user
    }
}

class Header extends Component {

    constructor(props) {
        super(props);
        this.profileButtonRef = React.createRef()
        this.homeButtonRef = React.createRef()
        this.settingsButtonRef = React.createRef()
        this.state = {
            showMenu: false
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user.loggedIn && !this.props.user.loggedIn) {
            this.homeButtonRef.current.click()
        }
    }

    handleLogout = () => {
        this.setState({showMenu: false})
        const username = this.props.user.username
        this.props.dispatch(logoutUser(username))
    }

    openSettingsMenu = () => {
        this.setState({showMenu: false})
        this.settingsButtonRef.current.click()
    }

    render() {
        if (!this.props.user.ui.showHeader) {
            return
        }
        return (
            <AppBar position="static" sx={{height: "10%"}}>
                <Toolbar>
                    <Grid container>
                        <Grid item xs={6} md={6} sx={{mt: 1}}>
                            <RouterLink to={"/"}>
                                <img src={"/mysecrets-logo.png"} alt={"MySecrets"}/>
                            </RouterLink>
                        </Grid>
                        {this.props.user.loggedIn ? (
                            <Grid item xs={6} md={5}>
                                <Stack direction={"row"} sx={{float: "right"}}>
                                    <Avatar sx={{bgcolor: "secondary.main", mt: 2, mb: 2, ml: 2}}>
                                        <IconButton sx={{color: "white"}} ref={this.profileButtonRef}
                                                    onClick={() => this.homeButtonRef.current.click()}>
                                            <HomeOutlined/>
                                        </IconButton>
                                    </Avatar>
                                    <Avatar sx={{bgcolor: "secondary.main", mt: 2, mb: 2, ml: 2}}>
                                        <IconButton sx={{color: "white"}} ref={this.profileButtonRef}
                                                    onClick={() => this.setState({showMenu: true})}>
                                            <PersonOutlined/>
                                        </IconButton>
                                        <Menu
                                            anchorEl={this.profileButtonRef.current}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'center',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'center',
                                            }}
                                            open={this.state.showMenu}
                                            onClose={() => this.setState({showMenu: false})}
                                            sx={{mt: 1}}
                                        >
                                            <MenuItem onClick={this.openSettingsMenu}>
                                                <ListItemIcon>
                                                    <SettingsOutlined color={"primary"}/>
                                                </ListItemIcon>
                                                <ListItemText>Settings</ListItemText>
                                            </MenuItem>
                                            <Divider/>
                                            <MenuItem onClick={this.handleLogout}>
                                                <ListItemIcon>
                                                    <LogoutOutlined color={"secondary"}/>
                                                </ListItemIcon>
                                                <ListItemText>Logout</ListItemText>
                                            </MenuItem>
                                        </Menu>
                                    </Avatar>
                                </Stack>
                            </Grid>
                        ) : ""}
                    </Grid>
                </Toolbar>
                <RouterLink hidden to={"/"}>
                    <Button ref={this.homeButtonRef}/>
                </RouterLink>
                <RouterLink hidden to={"/settings"}>
                    <Button ref={this.settingsButtonRef}/>
                </RouterLink>
            </AppBar>
        );
    }
}

export default connect(mapStateToProps)(Header)