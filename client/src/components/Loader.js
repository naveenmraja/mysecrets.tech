import {Component} from "react";
import {Backdrop, CircularProgress} from "@mui/material";

class Loader extends Component {
    render() {
        return (
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={this.props.showLoader}
            >
                <CircularProgress color="success"/>
            </Backdrop>
        )
    }
}

export default Loader;