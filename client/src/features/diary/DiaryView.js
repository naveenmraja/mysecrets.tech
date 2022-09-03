import {Component} from "react";
import * as React from 'react';
import {connect} from "react-redux";
import './Diary.css'
import Grid from "@mui/material/Grid";
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton, InputAdornment,
    Paper, Snackbar,
    Stack,
    TextField
} from "@mui/material";
import {
    ClearAllOutlined,
    DeleteOutlined,
    TodayOutlined,
    SaveOutlined,
    TitleOutlined,
    ArrowBackIosNew
} from "@mui/icons-material";
import {styled} from "@mui/styles";
import {
    clearCurrentEntryContent,
    createOrUpdateEntry,
    deleteEntry, fetchUserEntry, removeDateFromCalendarEntries, removeFromCurrentMonthEntries, updateCurrentEntry,
    updateCurrentEntryContent,
    updateCurrentEntryTitle, hideSnackbar, showLoader, hideLoader, resetUIElements
} from "./DiarySlice";
import {getMonthFromNumber} from "../../utils/Utils";
import {Navigate} from "react-router-dom";
import Calendar from "../../components/Calendar";
import {hideHeader, showHeader} from "../user/UserSlice";
import Loader from "../../components/Loader";
import MuiAlert from "@mui/material/Alert";

function mapStateToProps(state) {
    return {
        username : state.user.username,
        currentEntry : state.diary.currentEntry,
        currentEntrySaved : state.diary.currentEntrySaved,
        calendarEntries : state.diary.calendarEntries,
        ui : state.diary.ui,
        user : state.user
    }
}

const StyledPaper = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary
}))

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class DiaryView extends Component {

    constructor(props) {
        super(props);
        this.titleRef = React.createRef();
        this.textAreaRef = React.createRef();
        this.dateButtonRef = React.createRef();
        this.state = {
            showConfirmDeleteEntry : false,
            navigateToEntries : false,
            showPopover : false,
            shouldNavigateAfterDelete : false
        }
    }

    componentWillUnmount() {
        this.props.dispatch(showHeader())
    }

    componentDidMount() {
        this.props.dispatch(hideHeader())
        if(this.props.currentEntry.id && this.props.currentEntry.content.length === 0) {
            this.props.dispatch(fetchUserEntry(this.props.currentEntry.id))
        }
        if(this.props.currentEntry.title.length > 0) {
            this.textAreaRef.current.setSelectionRange(this.textAreaRef.current.value.length, this.textAreaRef.current.value.length)
            this.textAreaRef.current.focus()
        } else {
            this.titleRef.current.focus()
        }
    }

    clearEntryContent = () => {
        this.props.dispatch(clearCurrentEntryContent())
        this.textAreaRef.current.focus()
    }

    handleTextInput = (event) => {
        const text = event.target.value
        this.props.dispatch(updateCurrentEntryContent(text))
        if(((text.length > 100 && text.length % 20 === 0) || text.length % 50 === 0 || text.length === 5) && !this.props.currentEntrySaved) {
            this.props.dispatch(createOrUpdateEntry(this.props.currentEntry))
        }
    }

    handleDeleteEntry = (shouldNavigateAfterDelete) => {
        this.setState({ showConfirmDeleteEntry : false })
        const date = new Date(this.props.currentEntry.year, this.props.currentEntry.month, this.props.currentEntry.date)
        if(this.props.currentEntry.id) {
            const params = {
                entryId : this.props.currentEntry.id,
                username : this.props.username
            }
            this.props.dispatch(removeDateFromCalendarEntries(date.toDateString()))
            this.props.dispatch(removeFromCurrentMonthEntries(this.props.currentEntry.id))
            this.props.dispatch(deleteEntry(params))
            this.setState({shouldNavigateAfterDelete : shouldNavigateAfterDelete})
        }
    }

    saveCurrentEntry = () => {
        if(this.props.currentEntry.content.length > 0) {
            this.props.dispatch(createOrUpdateEntry(this.props.currentEntry))
        } else if(this.props.currentEntry.id) {
            this.handleDeleteEntry(false)
        }
    }

    handleBackButton = (event) => {
        event.preventDefault()
        this.props.dispatch(showLoader())
        this.saveCurrentEntry()
        setTimeout(() => {
            this.props.dispatch(hideLoader())
            this.setState({ navigateToEntries : true })
        }, 200)
    }

    handleUpdateEntry = (selectedDate) => {
        this.saveCurrentEntry()
        this.props.dispatch(resetUIElements())
        if(selectedDate.toDateString() in this.props.calendarEntries) {
            const newEntryId = this.props.calendarEntries[selectedDate.toDateString()]
            this.props.dispatch(fetchUserEntry(newEntryId))
        } else {
            let newEntry = {
                "id" : "",
                "title" : "",
                "date" : selectedDate.getDate(),
                "month" : selectedDate.getMonth(),
                "year" : selectedDate.getFullYear(),
                "content" : ""
            }
            this.props.dispatch(updateCurrentEntry(newEntry))
        }
        this.setState({ showPopover : false })
    }

     componentDidUpdate(prevProps, prevState, snapshot) {
        const prevDate = new Date(prevProps.currentEntry.year, prevProps.currentEntry.month, prevProps.currentEntry.date)
         const currentDate = new Date(this.props.currentEntry.year, this.props.currentEntry.month, this.props.currentEntry.date)
         if(prevDate < currentDate || prevDate > currentDate) {
             if(this.props.currentEntry.title.length > 0) {
                 this.textAreaRef.current.setSelectionRange(this.textAreaRef.current.value.length, this.textAreaRef.current.value.length)
                 this.textAreaRef.current.focus()
             } else if(this.titleRef.current) {
                 this.titleRef.current.focus()
             }
         }
     }

    closeSnackbar = () => {
        this.props.dispatch(hideSnackbar())
    }

    render() {
        if(!this.props.user.loggedIn) {
            return (<Navigate to={"/"}/>)
        }
        const date = `${getMonthFromNumber(this.props.currentEntry.month)} ${this.props.currentEntry.date}, ${this.props.currentEntry.year}`
        return(
            <Grid container
                  alignItems={"center"}
                  justifyContent={"center"}
                  direction={"row"}
                  sx={{height: "90vh", width: "100%"}}>
                <Grid container
                      alignItems={"center"}
                      justifyContent={"center"}
                      direction={"row"}
                      sx={{height: "10%", width: "100%"}}>
                    <Grid item xs={11} md={6} >
                        <Snackbar open={this.props.ui.showSnackbar && this.props.ui.errorMessage} autoHideDuration={5000} onClose={this.closeSnackbar}>
                            <Alert onClose={this.closeSnackbar} severity="error" sx={{ width: '100%' }}>
                                {this.props.ui.errorMessage}
                            </Alert>
                        </Snackbar>
                        <Stack direction="row" spacing={1}  sx={{float: "left"}}>
                            <Button variant={"outlined"} onClick={this.handleBackButton} className={"backArrow"}>
                                <ArrowBackIosNew />
                            </Button>
                            <Button variant={"outlined"} startIcon={<TodayOutlined />} ref={this.dateButtonRef}
                                    onClick={() => this.setState({showPopover : true})}>
                                {date}
                            </Button>
                            <Calendar showPopover={this.state.showPopover}
                                      onClosePopover={() => this.setState({ showPopover : false })}
                                      defaultValue={new Date(this.props.currentEntry.year,
                                          this.props.currentEntry.month, this.props.currentEntry.date)}
                                      defaultActiveStartDate={new Date(this.props.currentEntry.year,
                                          this.props.currentEntry.month, this.props.currentEntry.date)}
                                      anchorEl={this.dateButtonRef.current}
                                      anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                                      handleDateSelection={this.handleUpdateEntry}/>
                        </Stack>
                        <Stack direction="row" spacing={1}  sx={{float: "right"}}>
                            <IconButton color={"secondary"} size={"small"}
                                        disabled={this.props.currentEntry.content.length === 0}
                                        onClick={this.clearEntryContent}>
                                <ClearAllOutlined />
                            </IconButton>
                            <IconButton color={"secondary"} size={"small"}
                                        disabled={this.props.currentEntrySaved}
                                        onClick={() => this.props.dispatch(createOrUpdateEntry(this.props.currentEntry))}>
                                <SaveOutlined />
                            </IconButton>
                            <IconButton color={"secondary"} size={"small"}
                                        disabled={this.props.currentEntry.id.length === 0}
                                        onClick={() => this.setState({ showConfirmDeleteEntry : true })}>
                                <DeleteOutlined />
                            </IconButton>
                            <Dialog open={this.state.showConfirmDeleteEntry}
                                    onClose={() => this.setState({ showConfirmDeleteEntry : false })}>
                                <DialogTitle id="alert-dialog-title">
                                    {"Confirm delete entry?"}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Are you sure you want to delete the entry?
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => this.setState({ showConfirmDeleteEntry : false })}>
                                        No
                                    </Button>
                                    <Button onClick={() => this.handleDeleteEntry(true)} autoFocus>
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Stack>
                    </Grid>
                </Grid>
                <Grid container
                      alignItems={"center"}
                      justifyContent={"center"}
                      sx={{height: "90%", width: "100%"}}>
                    <Grid item xs={11} md={6} sx={{height: "100%"}}>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Title"
                            autoComplete="title"
                            size={"small"}
                            placeholder={"Title"}
                            inputRef={this.titleRef}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TitleOutlined color={"secondary"} />
                                    </InputAdornment>
                                )
                            }}
                            value={this.props.currentEntry.title}
                            onChange={(event) => this.props.dispatch(updateCurrentEntryTitle(event.target.value))}
                            sx={{marginTop: "0"}}
                        />
                        <StyledPaper elevation={24} sx={{ height: "100%", width: "100%", bgcolor: "#fff8c0", overflow: "scroll"}}>
                            <textarea value={this.props.currentEntry.content} ref={this.textAreaRef}
                                      onChange={this.handleTextInput}/>
                        </StyledPaper>
                    </Grid>
                    <Loader showLoader={this.props.ui.showLoader}/>
                </Grid>
                {((this.props.ui.currentEntryDeleted && this.state.shouldNavigateAfterDelete) ||
                    this.state.navigateToEntries) ? (<Navigate to={"/entries"} />) : ""}
            </Grid>
        )
    }
}

export default connect(mapStateToProps)(DiaryView)