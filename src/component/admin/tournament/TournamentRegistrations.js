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
//import AddParticipantToTournamentModal from "./AddParticipantToTournamentModal";

import AuthService from "../../../service/auth-service";


const TOURNAMENT_REGISTRATIONS = "http://localhost:8081/tournament_registrations";
const TOURNAMENT_EVENTS = "http://localhost:8081/tournament_events";

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
        //hidden: true,
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
            sayonaraMeeting: false
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
            let sayonaraColumnDef = Object.assign(columns[5], { hidden: !data.sayonaraMeeting });            
            columns[5] = sayonaraColumnDef;
            this.setState({ sayonaraMeeting: data.sayonaraMeeting });
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
        const TOURNAMENT_REGISTRATIONS_FOR_TOURNAMENT = "http://localhost:8081/tournament_events/" + this.props.id +"/tournament_registrations";
        
        return(            
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <div>
                    <EditTournamentRegistrationModal  show={this.state.editModalShow}
                                                onHide={() => {
                                                    this.setState({ editModalShow: false, selectedRowsIds: [] });
                                                    this.crudTableRef.current.unselectAllRows();
                                                    this.crudTableRef.current.fillTable();
                                                    this.props.onRegistrationUpdate();
                                                }}
                                                itemId={this.state.selectedRowsIds[0]}
                                                eventId={this.props.id}
                    />              
                    {/* <AddParticipantToTournamentModal  show={this.state.addModalShow}
                                                onHide={() => {
                                                    this.setState({ addModalShow: false, selectedRowsIds: [] });
                                                    this.crudTableRef.current.unselectAllRows();
                                                    this.crudTableRef.current.fillTable();                                                    
                                                }}
                                                itemId={this.state.selectedRowsIds[0]}
                                                eventId={this.props.id}
                                                sayonaraMeeting={this.state.sayonaraMeeting}
                    />  */}
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