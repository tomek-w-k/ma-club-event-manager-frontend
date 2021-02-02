import React, {Component} from "react";
import CrudTableComponent from "../CrudTableComponent";
import {
    Card,
    Alert
} from "react-bootstrap";
import {textFilter} from 'react-bootstrap-table2-filter';
import {Check, X} from "react-bootstrap-icons";
import EditTournamentRegistrationInTeamModal from "./EditTournamentRegistrationInTeamModal";
import AddParticipantToTeamModal from "./AddParticipantToTeamModal";
import AuthService from "../../service/auth-service";
import * as Urls from "../../servers-urls";


const currentUser = AuthService.getCurrentUser();


const ColumnNames = Object.freeze({
    ID: 0,
    FULL_NAME: 1,
    CLUB_NAME: 2,
    FEE_RECEIVED: 3,
    SAYONARA_MEETING_PARTICIPATION: 4,
    AS_JUDGE_PARTICIPATION: 5,
    ROOM_TYPE_NAME: 6,
    STAY_PERIOD_NAME: 7,
    CATEGORY_NAME: 8
});

const columns = [
    {
        dataField: "id",
        sort: false,
        hidden: true
    },
    {
        dataField: "user.fullName",
        text: "Full name",
        sort: true, 
        filter: textFilter()           
    },    
    {
        dataField: "user.club.clubName",
        text: "Club",
        sort: true, 
        filter: textFilter()           
    },
    { 
        dataField: "feeReceived", 
        text: "Fee received",
        sort: false,
        type: "bool",
        style:  { "text-align": "center" },
        headerStyle:  { "text-align": "center" },
        formatter: (cell, row) => {
            return cell ? (<div><Check color="#008495" size={22}/></div>) : (<div><X color="#CB2334" size={22}/></div>)            
        }        
    },
    { 
        dataField: "sayonaraMeetingParticipation", 
        text: "Sayonara",
        hidden: true,
        sort: false,
        type: "bool",
        style:  { "text-align": "center" },
        headerStyle:  { "text-align": "center" },
        formatter: (cell, row) => {
            return cell ? (<div><Check color="#008495" size={22}/></div>) : (<div><X color="#CB2334" size={22}/></div>)            
        }        
    },
    { 
        dataField: "asJudgeParticipation",
        text: "As a Judge",
        sort: false,
        type: "bool",
        style:  { "text-align": "center" },
        headerStyle:  { "text-align": "center" },
        formatter: (cell, row) => {
            return cell ? (<div><Check color="#008495" size={22}/></div>) : (<div><X color="#CB2334" size={22}/></div>)            
        }        
    },             
    {
        dataField: "roomType.roomTypeName",
        text: "Room type",
        hidden: true,
        sort: true, 
        filter: textFilter(),
        formatter: (cell, row) => {
            if (typeof cell == "undefined" )
                return "-"
            else return cell;
        }
    },
    {
        dataField: "stayPeriod.stayPeriodName",
        text: "Stay period",
        hidden: true,
        sort: true, 
        filter: textFilter(),
        formatter: (cell, row) => {
            if (typeof cell == "undefined" )
                return "-"
            else return cell;
        }
    },
    {
        dataField: "weightAgeCategory.categoryName",
        text: "Weight / age category",
        sort: true, 
        filter: textFilter(),
        formatter: (cell, row) => {
            if (typeof cell == "undefined" )
                return "-"
            else return cell;
        }
    },    
];

const emptyTableMessage = () => {
    return(
        <div>
            Please click "Sign up participant" button to register a participant<br />
            Click "Sign up me" to register yourself 
        </div>            
    )
}


class Team extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            editModalShow: false,
            addModalShow: false,            
            signUpMe: false,
            selectedRowsIds: [],            
            team: null,
            eventId: null,
            teamId: null,
            sayonaraMeeting: false,
            accommodation: false,
            stateUpdated: false,            
        };

        this.handleShowAddParticipantToTeamModal = this.handleShowAddParticipantToTeamModal.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.handleDeleteRegistration = this.handleDeleteRegistration.bind(this);

        this.crudTableRef = React.createRef();
    }

    componentDidMount()
    {
        fetch(Urls.WEBSERVICE_URL + "/teams/" + this.props.match.params.teamId)
        .then(response => response.json())
        .then(teamData => {
            fetch(Urls.WEBSERVICE_URL + "/tournament_events/" + teamData.eventId)
            .then(response => response.json())        
            .then(eventData => {            
                columns[ColumnNames.SAYONARA_MEETING_PARTICIPATION] = {...columns[ColumnNames.SAYONARA_MEETING_PARTICIPATION],  hidden: !eventData.sayonaraMeeting };
                columns[ColumnNames.ROOM_TYPE_NAME] = {...columns[ColumnNames.ROOM_TYPE_NAME], hidden: !eventData.accommodation};
                columns[ColumnNames.STAY_PERIOD_NAME] = {...columns[ColumnNames.STAY_PERIOD_NAME], hidden: !eventData.accommodation};
                
                this.setState({ 
                    team: teamData,
                    eventId: eventData.id,
                    teamId: teamData.id,
                    sayonaraMeeting: eventData.sayonaraMeeting,
                    accommodation: eventData.accommodation,
                    stateUpdated: true                    
                });                                           
            });            
        });
    }

    handleShowAddParticipantToTeamModal(signUpMe)
    {        
        if ( signUpMe )        
            this.setState({ 
                addModalShow: true,
                signUpMe: true
            });
        else
            this.setState({ 
                addModalShow: true,
                signUpMe: false
            });
    }

    handleRowClick(selectedRowsIds)
    {
        this.setState({ 
            editModalShow: true,
            selectedRowsIds: selectedRowsIds            
        });  
    }

    handleRowSelection(selectedRowsIds)
    {
        this.setState({
            selectedRowsIds: selectedRowsIds
        });
    }

    handleDeleteRegistration()
    {
        if ( this.state.selectedRowsIds.length == 1 )
        {
            if ( !window.confirm("Are you sure?") )
                return;

            fetch(Urls.WEBSERVICE_URL + "/tournament_registrations/" + this.state.selectedRowsIds[0], {
                method: "DELETE",
                header : {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            })
            .then(result => {
                this.setState({ selectedRowsIds: [] });
                this.crudTableRef.current.unselectAllRows();
                this.crudTableRef.current.fillTable();
            },
            error => {
                alert("Item not deleted.")
            })
        }
        else alert("Please select one registration to remove");
    }

    render()
    {
        const TOURNAMENT_REGISTRATIONS_FOR_TEAM = Urls.WEBSERVICE_URL + "/teams/" + this.props.match.params.teamId + "/tournament_registrations";

        this.props.navbarControlsHandler();

        return (        
            this.state.stateUpdated && (
                currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ||
                                        (this.state.team.trainer.id == currentUser.id && currentUser.roles.includes("ROLE_TRAINER")) ? 
                (
                    <div>
                        {this.state.eventId !=null ? (
                            <div>
                                <EditTournamentRegistrationInTeamModal  show={this.state.editModalShow}
                                                                        onHide={() => {
                                                                            this.setState({ editModalShow: false, selectedRowsIds: [] });
                                                                            this.crudTableRef.current.unselectAllRows();
                                                                            this.crudTableRef.current.fillTable();                                                            
                                                                        }}
                                                                        itemId={this.state.selectedRowsIds[0]}
                                                                        eventId={this.state.eventId}
                                                                        teamId={this.state.teamId}
                                                                        sayonaraMeeting={this.state.sayonaraMeeting}
                                                                        accommodation={this.state.accommodation}
                                /> 
                                <AddParticipantToTeamModal              show={this.state.addModalShow}
                                                                        onHide={() => {
                                                                            this.setState({ addModalShow: false, selectedRowsIds: [] });
                                                                            this.crudTableRef.current.unselectAllRows();
                                                                            this.crudTableRef.current.fillTable();                                                    
                                                                        }}                                                                
                                                                        eventId={this.state.eventId}
                                                                        teamId={this.state.teamId}
                                                                        sayonaraMeeting={this.state.sayonaraMeeting}
                                                                        accommodation={this.state.accommodation}
                                                                        signUpMe={this.state.signUpMe}
                                />   
                            </div>                                    
                        ) : (<div></div>)}                    
                        <Card>
                            <Card.Body>
                                <Card.Text>
                                    <CrudTableComponent itemsUrl={TOURNAMENT_REGISTRATIONS_FOR_TEAM} 
                                                        tableColumns={columns} 
                                                        selectedItemId={this.handleRowClick}
                                                        selectedIds={this.handleRowSelection}
                                                        emptyTableMessage={emptyTableMessage}
                                                        ref={this.crudTableRef}
                                    />
                                </Card.Text>
                            </Card.Body>                    
                        </Card>                    
                    </div>
                ) : (
                    <Alert variant="danger">
                        <Alert.Heading>Access denided</Alert.Heading>
                        <p>You have no priviledges granted to view this section.</p>
                    </Alert>
                )
            )
        );
    }
}

export default Team;