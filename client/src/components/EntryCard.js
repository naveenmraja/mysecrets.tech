import {Component} from "react";
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import {DeleteOutlined, EditOutlined} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid"
import '../features/diary/Diary.css'
import {getMonthFromNumber} from "../utils/Utils";
import {connect} from "react-redux";
import {
    deleteEntry,
    removeDateFromCalendarEntries,
    removeFromCurrentMonthEntries,
    updateCurrentEntry
} from "../features/diary/DiarySlice";
import {Navigate} from "react-router-dom";

function mapStateToProps(state) {
    return {
        username: state.user.username,
        diary: state.diary,
        ui: state.diary.ui
    }
}

class EntryCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            navigateToEdit: false,
            entryDeleted: false,
            showConfirmDeleteEntry: false
        }
    }

    handleDeleteEntry = (event) => {
        event.preventDefault()
        const entryDate = new Date(this.props.entry.year, this.props.entry.month, this.props.entry.date)
        this.props.dispatch(removeDateFromCalendarEntries(entryDate.toDateString()))
        const params = {
            entryId: this.props.entry.id,
            username: this.props.username
        }
        this.props.dispatch(deleteEntry(params))
        this.props.dispatch(removeFromCurrentMonthEntries(this.props.entry.id))
        this.setState({entryDeleted: true})
        this.setState({showConfirmDeleteEntry: false})
    }

    handleEdit = (event) => {
        event.preventDefault()
        this.props.dispatch(updateCurrentEntry(this.props.entry))
        this.setState({navigateToEdit: true})
    }

    render() {
        if (this.state.entryDeleted) {
            return
        }
        const subheader = `${getMonthFromNumber(this.props.entry.month)} ${this.props.entry.date}, ${this.props.entry.year}`
        const content = `${this.props.entry.content.slice(0, 147)}` + `${this.props.entry.content.length > 147 ? "..." : ""}`
        let title = `${this.props.entry.title ? this.props.entry.title.slice(0, 30) : "Untitled"}`
        title = title + `${this.props.entry.title.length > 30 ? "..." : ""}`
        return (
            <Grid item xs={12} md={4} className={"entryCard"}>
                <Card sx={{height: "90%", bgcolor: "#fff8c0", width: "100%"}} raised>
                    <CardActionArea onClick={this.handleEdit} sx={{height: "80%"}}>
                        <CardHeader title={title}
                                    subheader={subheader} sx={{height: "30%"}}/>
                        <CardContent sx={{borderTop: "3px solid #ff4081", height: "50%"}}>
                            <Typography variant="body1" color="text.secondary" sx={{whiteSpace: "pre-wrap"}}>
                                {content}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions sx={{float: "right", height: "20%"}}>
                        <Button color={"primary"} startIcon={<EditOutlined/>} onClick={this.handleEdit}>
                            Edit
                        </Button>
                        <Button color={"secondary"} startIcon={<DeleteOutlined/>}
                                onClick={() => this.setState({showConfirmDeleteEntry: true})}>
                            Delete
                        </Button>
                        <Dialog open={this.state.showConfirmDeleteEntry}
                                onClose={() => this.setState({showConfirmDeleteEntry: false})}>
                            <DialogTitle id="alert-dialog-title">
                                {"Confirm delete entry?"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to delete the entry?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => this.setState({showConfirmDeleteEntry: false})}>
                                    No
                                </Button>
                                <Button onClick={this.handleDeleteEntry} autoFocus>
                                    Yes
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </CardActions>
                </Card>
                {this.state.navigateToEdit ? (<Navigate to={"/diary"}/>) : ("")}
            </Grid>
        )
    }
}

export default connect(mapStateToProps)(EntryCard)