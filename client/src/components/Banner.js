import { Component } from "react";
import {Card, CardContent, Grid, Typography} from "@mui/material";

class Banner extends Component {

    render() {
        if(!this.props.bannerMessage) {
            return
        }
        const style = {
            maxWidth: "100%",
            backgroundColor: this.props.color ? this.props.color : "secondary.main",
            paddingBotttom: "0px",
            margin: "auto",
            width: "fit-content"
        }
        return (
            <Grid item md={12} xs={12}>
                <Card raised sx={style}>
                    <CardContent >
                        <Typography component={'span'} variant={"body1"} color={"white"}>
                            {this.props.bannerMessage}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        )
    }
}

export default Banner;