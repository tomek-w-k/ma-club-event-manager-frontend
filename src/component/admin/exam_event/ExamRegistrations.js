import React, {Component} from "react";
import CrudTableComponent from "../../CrudTableComponent";
import {
    Card,  
    Button,
    Accordion
} from "react-bootstrap";
import { textFilter } from 'react-bootstrap-table2-filter';
import {Check, X} from "react-bootstrap-icons";
import EditExamRegistrationModal from "./EditExamRegistrationModal";
import AddParticipantToExamModal from "./AddParticipantToExamModal";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const EXAM_REGISTRATIONS = Urls.WEBSERVICE_URL + "/exam_registrations";
const EXAM_EVENTS = Urls.WEBSERVICE_URL + "/exam_events";

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
        dataField: "user.email",
        text: "Email",
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
        dataField: "participationAccepted", 
        text: "Participation accepted",
        sort: false,
        type: "bool",
        style:  { "text-align": "center" },
        headerStyle:  { "text-align": "center" },
        formatter: (cell, row) => {
            return cell ? (<div><Check color="#008495" size={22}/></div>) : (<div><X color="#CB2334" size={22}/></div>)            
        }        
    },             
];


class ExamRegistrations extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            editModalShow: false,
            addModalShow: false,
            //selectedItemId: undefined,
            selectedRowsIds: []
        };
        
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);

        this.crudTableRef = React.createRef();
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

            fetch(EXAM_REGISTRATIONS + "/" + this.state.selectedRowsIds[0], {
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
        const EXAM_REGISTRATIONS_FOR_EXAM = Urls.WEBSERVICE_URL + "/exam_events/" + this.props.id + "/exam_registrations";

        return(            
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <div>
                    <EditExamRegistrationModal  show={this.state.editModalShow}
                                                onHide={() => {
                                                    this.setState({ editModalShow: false, selectedRowsIds: [] });
                                                    this.crudTableRef.current.unselectAllRows();
                                                    this.crudTableRef.current.fillTable();
                                                }}
                                                itemId={this.state.selectedRowsIds[0]}
                    />
                    <AddParticipantToExamModal  show={this.state.addModalShow}
                                                onHide={() => {
                                                    this.setState({ addModalShow: false, selectedRowsIds: [] });
                                                    this.crudTableRef.current.unselectAllRows();
                                                    this.crudTableRef.current.fillTable();                                                    
                                                }}
                                                itemId={this.state.selectedRowsIds[0]}
                                                eventId={this.props.id}                                                
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
                                <CrudTableComponent itemsUrl={EXAM_REGISTRATIONS_FOR_EXAM} 
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

export default ExamRegistrations;