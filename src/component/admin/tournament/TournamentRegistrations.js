import React, {Component} from "react";
import CrudTableComponent from "../../CrudTableComponent";
import {
    Card,    
    Button,    
    Accordion
} from "react-bootstrap";
import { textFilter } from 'react-bootstrap-table2-filter';
import {Check, SortUp, X} from "react-bootstrap-icons";
import EditTournamentRegistrationModal from "./EditTournamentRegistrationModal";
import AddParticipantToTournamentModal from "./AddParticipantToTournamentModal";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const TOURNAMENT_REGISTRATIONS = Urls.WEBSERVICE_URL + "/tournament_registrations";
const TOURNAMENT_EVENTS = Urls.WEBSERVICE_URL + "/tournament_events";

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


class TournamentRegistrations extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            editModalShow: false,
            addModalShow: false,            
            selectedRowsIds: [],            
            sayonaraMeeting: false,
            accommodation: false
        };
               
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);

        this.crudTableRef = React.createRef();
    }

    componentDidMount()
    {
        fetch(TOURNAMENT_EVENTS + "/" + this.props.id)
        .then(response => response.json())        
        .then(data => {            
            columns[ColumnNames.SAYONARA_MEETING_PARTICIPATION] = {...columns[ColumnNames.SAYONARA_MEETING_PARTICIPATION],  hidden: !data.sayonaraMeeting };
            columns[ColumnNames.ROOM_TYPE_NAME] = {...columns[ColumnNames.ROOM_TYPE_NAME], hidden: !data.accommodation};
            columns[ColumnNames.STAY_PERIOD_NAME] = {...columns[ColumnNames.STAY_PERIOD_NAME], hidden: !data.accommodation};
            
            this.setState({ 
                sayonaraMeeting: data.sayonaraMeeting,
                accommodation: data.accommodation
            });
            this.forceUpdate();
        });
    }

    handleShowAddParticipantModal()
    {
        this.setState({ addModalShow: true });
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

    handleDeleteItem()
    {
        if ( this.state.selectedRowsIds.length == 1 )
        {
            if ( !window.confirm("Are you sure?") )
                return;

            fetch(TOURNAMENT_REGISTRATIONS + "/" + this.state.selectedRowsIds[0], {
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
        const currentUser = AuthService.getCurrentUser();
        const TOURNAMENT_REGISTRATIONS_FOR_TOURNAMENT = Urls.WEBSERVICE_URL + "/tournament_events/" + this.props.id + "/tournament_registrations";
        
        return(            
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <div>
                    <EditTournamentRegistrationModal    show={this.state.editModalShow}
                                                        onHide={() => {
                                                            this.setState({ editModalShow: false, selectedRowsIds: [] });
                                                            this.crudTableRef.current.unselectAllRows();
                                                            this.crudTableRef.current.fillTable();
                                                            this.props.onRegistrationUpdate();
                                                        }}
                                                        itemId={this.state.selectedRowsIds[0]}
                                                        eventId={this.props.id}
                                                        sayonaraMeeting={this.state.sayonaraMeeting}
                                                        accommodation={this.state.accommodation}
                    />              
                    <AddParticipantToTournamentModal    show={this.state.addModalShow}
                                                        onHide={() => {
                                                            this.setState({ addModalShow: false, selectedRowsIds: [] });
                                                            this.crudTableRef.current.unselectAllRows();
                                                            this.crudTableRef.current.fillTable();                                                    
                                                        }}
                                                        itemId={this.state.selectedRowsIds[0]}
                                                        eventId={this.props.id}
                                                        sayonaraMeeting={this.state.sayonaraMeeting}
                                                        accommodation={this.state.accommodation}
                    /> 
                    <Accordion defaultActiveKey="0">
                    <Card>
                        {/* style={{backgroundColor: "#EAECEE"}} */}
                        <Card.Header >
                            <div className="d-flex">
                                <div style={{display: "flex", alignItems: "center"}}>PARTICIPANTS</div>
                                <Accordion.Toggle className="ml-auto" as={Button} variant="secondary" eventKey="0">Show / Hide</Accordion.Toggle>
                            </div> 
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <Card.Text>
                                <CrudTableComponent itemsUrl={TOURNAMENT_REGISTRATIONS_FOR_TOURNAMENT} 
                                                    tableColumns={columns} 
                                                    selectedItemId={this.handleRowClick}
                                                    selectedIds={this.handleRowSelection}
                                                    ref={this.crudTableRef}
                                />
                            </Card.Text>
                        </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    </Accordion>
                </div>
            ): (<h2>You do not have priviledges  granted to view this section.</h2 >)
        );
    }
}

export default TournamentRegistrations;