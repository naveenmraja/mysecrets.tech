import * as React from 'react';
import {Component} from 'react';
import {connect} from "react-redux";
import SignUpView from "./SignUpView";
import LogInView from "./LogInView";
import {Navigate} from "react-router-dom";
import {getUser} from "./UserSlice";
import Loader from "../../components/Loader";

function mapStateToProps(state) {
    return {
        user: state.user,
        ui: state.user.ui
    }
}

class HomeView extends Component {

    componentDidMount() {
        this.props.dispatch(getUser())
    }

    render() {
        if (this.props.user.loggedIn) {
            return (<Navigate to={"/entries"}/>)
        }
        if (this.props.ui.showLoader) {
            return (<Loader showLoader={this.props.ui.showLoader}/>)
        } else if (this.props.ui.showLogin) {
            return (<LogInView/>)
        } else if (this.props.ui.showSignup) {
            return (<SignUpView/>)
        }
    }
}

export default connect(mapStateToProps)(HomeView)