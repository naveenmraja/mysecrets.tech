import { Component } from "react";
import * as React from 'react'
import { connect } from "react-redux";
import Grid from "@mui/material/Grid";
import {styled} from "@mui/styles";
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Paper,
    Tab,
    Tabs, Skeleton
} from "@mui/material";
import { tabsClasses } from '@mui/material/Tabs';
import {
    fetchCalendar,
    fetchCurrentMonthEntries, fetchUserEntry,
    resetCurrenEntry, resetUIElements, updateCurrentEntry,
    updateCurrentMonth,
    updateCurrentYear
} from "./DiarySlice";
import {CreateOutlined} from "@mui/icons-material";
import './Diary.css'
import EntryCard from "../../components/EntryCard";
import Banner from "../../components/Banner";
import Calendar from "../../components/Calendar";
import {Navigate} from "react-router-dom";

function mapStateToProps(state) {
    return {
        user : state.user,
        diary : state.diary,
        ui : state.diary.ui
    }
}

const StyledPaper = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary
}))

class ListEntriesView extends Component {

    constructor(props) {
        super(props);
        this.createEntryButtonRef = React.createRef()
        this.state = {
            showPopover : false,
            navigateToEdit : false
        }
    }

    componentDidMount() {
        this.props.dispatch(resetCurrenEntry())
        this.props.dispatch(resetUIElements())
        this.props.dispatch(fetchCalendar(this.props.user.username))
        const params = {
            month : this.props.diary.currentMonth,
            year : this.props.diary.currentYear
        }
        this.props.dispatch(fetchCurrentMonthEntries(params))
    }

    updateYear = (event) => {
        const year = event.target.value
        const currentDate = new Date()
        this.props.dispatch(updateCurrentYear(year))
        const params = {
            month : (year === currentDate.getFullYear() ? currentDate.getMonth() : 0),
            year : year
        }
        this.props.dispatch(fetchCurrentMonthEntries(params))
    }

    updateMonth = (event, currentMonth) => {
        this.props.dispatch(updateCurrentMonth(currentMonth))
        const params = {
            month : currentMonth,
            year : this.props.diary.currentYear
        }
        this.props.dispatch(fetchCurrentMonthEntries(params))
    }

    handleCreateEntry = (selectedDate) => {
        let newEntry = {
            "id" : "",
            "title" : "",
            "date" : selectedDate.getDate(),
            "month" : selectedDate.getMonth(),
            "year" : selectedDate.getFullYear(),
            "content" : ""
        }
        if(selectedDate.toDateString() in this.props.diary.calendarEntries) {
            newEntry.id = this.props.diary.calendarEntries[selectedDate.toDateString()]
            this.props.dispatch(fetchUserEntry(newEntry.id))
        } else {
            this.props.dispatch(updateCurrentEntry(newEntry))
        }
        this.setState({ navigateToEdit : true })
    }

    render() {
        if(!this.props.user.loggedIn) {
            return (<Navigate to={"/"}/>)
        }
        if(this.state.navigateToEdit) {
            return (<Navigate to={"/diary"}/>)
        }
        let yearsMenuItems = []
        let monthsTabs = []
        let entries = []
        this.props.diary.years.forEach((year) => {
            yearsMenuItems.push(<MenuItem value={year.value} key={`Year:${year.value}`}>{year.label}</MenuItem>)
        })
        this.props.diary.months.forEach((month) => {
            monthsTabs.push(<Tab value={month.value} label={month.label} key={`Month:${month.value}`}/>)
        })
        this.props.diary.currentMonthEntries.forEach((entry) => {
            entries.push(<EntryCard entry={entry} key={entry.id}/>)
        })
        if(this.props.ui.showSkeleton) {
            for(let i=0; i< 3; i++) {
                entries.push(
                    <Grid item xs={12} md={4} className={"entryCard"} key={`skeleton-${i}`}>
                        <Skeleton variant={"rectangular"} height={"100%"} animation={"wave"}/>
                    </Grid>
                )
            }
        } else if(entries.length === 0) {
            const bannerMessage = this.props.ui.errorMessage ? this.props.ui.errorMessage : "No entries available for this month"
            const color = this.props.ui.errorMessage ? "error.main" : "secondary.main"
            entries.push(<Banner bannerMessage={bannerMessage} color={color} key={"banner-message"}/>)
        }
        if(this.props.diary.retryFetchCalendar) {
            setTimeout(() => {
                this.props.dispatch(fetchCalendar(this.props.user.username))
            }, 10000)
        }
        return(
            <Grid container alignItems="center" justify="center" direction={"row"}
                  sx={{height: "90vh", width: "100%"}}>
                <Grid container alignItems="center" justify="center" direction={"row"}
                      sx={{height: "10%", width: "100%"}}>
                    <Grid item xs={1} md={1} />
                    <Grid item xs={5} md={2}>
                        <Button color={"secondary"} type="submit" variant="contained" ref={this.createEntryButtonRef}
                                startIcon={<CreateOutlined/>} onClick={() => this.setState({showPopover : true})}>
                            New Entry
                        </Button>
                        <Calendar showPopover={this.state.showPopover}
                                  onClosePopover={() => this.setState({ showPopover : false })}
                                  anchorEl={this.createEntryButtonRef.current} anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                                  handleDateSelection={this.handleCreateEntry}/>
                    </Grid>
                    <Grid item xs={5} md={8}>
                        <FormControl sx={{minWidth: 120, float: 'right'}} size={"small"}>
                            <InputLabel id="yearSelect">Year</InputLabel>
                            <Select value={this.props.diary.currentYear} label="Year" onChange={this.updateYear}>
                                {yearsMenuItems}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container
                      sx={{height: "90%", width: "100%"}}>
                    <Grid item xs={1} md={1} />
                    <Grid item xs={12} md={10} sx={{height: "100%"}}>
                        <StyledPaper elevation={24} sx={{height: "100%", padding: "2%", width: "100%"}}>
                            <Grid container direction={"row"} sx={{height: "10%", width: "100%"}}>
                                <Grid item xs={12} md={12}  sx={{height: "100%"}}>
                                    <Tabs value={this.props.diary.currentMonth} onChange={this.updateMonth}
                                        textColor="secondary" indicatorColor="secondary" variant="scrollable"
                                        scrollButtons sx={{
                                        [`& .${tabsClasses.scrollButtons}`]: {
                                            '&.Mui-disabled': { opacity: 0.3 },
                                        },
                                    }}>
                                        {monthsTabs}
                                    </Tabs>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} direction={"row"}
                                  sx={{height: "90%", marginTop: "1%", overflow: "scroll"}}>
                                {entries}
                            </Grid>
                        </StyledPaper>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default connect(mapStateToProps)(ListEntriesView)