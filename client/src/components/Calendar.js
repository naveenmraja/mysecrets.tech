import { Component } from "react";
import {styled} from "@mui/styles";
import {Badge, Button, Paper, Popover} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import {connect} from "react-redux";
import './Calendar.css'
import {Calendar as ReactCalendar} from "react-calendar";

function mapStateToProps(state) {
    return {
        calendarEntries : state.diary.calendarEntries
    }
}

const StyledPaper = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary
}))

class Calendar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            disableConfirmButton : false,
            selectedDate : new Date()
        }
    }

    formatDate = (date) => {
        if(date.toDateString() in this.props.calendarEntries) {
            return (
                <Badge color={"secondary"} overlap="circular"
                       anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                       variant="dot">
                    <Avatar sx={{width: 24, height: 24, bgcolor: "primary.main", fontSize: 12, margin: "0 auto"}}
                            variant={"square"}>
                        {date.getDate()}
                    </Avatar>
                </Badge>
            )
        } else if(date.getFullYear() >= 2000 && date <= new Date()) {
            return (
                <Avatar sx={{width: 24, height: 24, bgcolor: "primary.main", fontSize: 12, margin: "0 auto"}}
                        variant={"square"}>
                    {date.getDate()}
                </Avatar>
            )
        } else {
            return (date.getDate())
        }
    }

    handleConfirmation = () => {
        this.setState({ disableConfirmButton : true })
        this.props.handleDateSelection(this.state.selectedDate)
        this.setState({ disableConfirmButton : false })
    }

    render() {
        return (
            <Popover
                open={this.props.showPopover}
                anchorEl={this.props.anchorEl}
                onClose={this.props.onClosePopover}
                anchorOrigin={this.props.anchorOrigin}
            >
                <StyledPaper  sx={{border: "none", outline: "none"}}>
                    <ReactCalendar maxDate={new Date()} minDate={new Date(2000, 0, 1)}
                                   onChange={(value, event) => this.setState({ selectedDate : value })}
                                   defaultValue={this.props.defaultValue} defaultActiveStartDate={this.props.defaultActiveStartDate}
                                   formatDay={(locale, date) => this.formatDate(date)} sx={{border: "none", outline: "none"}}/>
                    <Button fullWidth color={"secondary"} size={"small"} variant={"contained"} sx={{margin: "2% auto"}}
                            onClick={this.handleConfirmation} disabled={this.state.disableConfirmButton}>Confirm</Button>
                </StyledPaper>
            </Popover>
        )
    }
}

export default connect(mapStateToProps)(Calendar)