import React, {Component} from "react";
import {
    Modal, 
    Form,
    Button,
    Row,
    Container
    } from "react-bootstrap";
import Select from "react-select";
import CrudTableComponent from "../../CrudTableComponent";
import { textFilter } from 'react-bootstrap-table2-filter';
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();
const EXAM_REGISTRATION_API_URL = Urls.WEBSERVICE_URL + "/exam_registrations";
const USERS_API_URL = Urls.WEBSERVICE_URL + "/users";
const EXAM_EVENTS = Urls.WEBSERVICE_URL + "/exam_events"; 
const EXAM_REGISTRATIONS = Urls.WEBSERVICE_URL + "/exam_registrations"; 

const columns = [
    {
        dataField: "id",
        sort: false,
        hidden: true
    },
    {
        dataField: "fullName",
        text: "Full name",
        sort: true, 
        filter: textFilter()           
    },
    // {
    //     dataField: "email", 
    //     text: "Email",
    //     sort: false,        
    //     filter: textFilter(),                       
    // },
    {            
        dataField: "country",
        text: "Country",
        sort: true,
        filter: textFilter(),
    },
    {            
        dataField: "club.clubName",
        text: "Club",
        sort: true,
        filter: textFilter(),
    }
];


class AddParticipantToExamModal extends Component
{
    constructor(props)
    {        
        super(props);
        this.state = {
            examRegistration: {
                id: null,
                user: null,
                feeReceived: false,
                participationAccepted: false,                
                examEvent: {
                    id: this.props.eventId                    
                }
            },            
            selectedRowsIds: []
        }        
        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
    }

    handleRowClick(selectedRowsIds)
    {
        this.setState({             
            selectedRowsIds: selectedRowsIds            
        });
    }

    handleRowSelection(selectedRowsIds)
    {
        this.setState({
            selectedRowsIds: selectedRowsIds
        });
    }

    handleClearForm()
    {
        this.setState({
            examRegistration: {
                id: null,
                user: null,
                feeReceived: false,
                participationAccepted: false,                
                examEvent: {
                    id: this.props.eventId                    
                }
            },
            selectedRowsIds: []
        });
    }
    
    handleSignUp(e)
    {
        e.preventDefault();
        
        if ( this.state.selectedRowsIds.length == 1 )
        {  
            let examRegistration = {...this.state.examRegistration, user: {id: this.state.selectedRowsIds[0]}};
            fetch(EXAM_REGISTRATIONS, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(examRegistration)           
            })            
            .then(result => {            
                return new Promise((resolve, reject) => {
                    if(result.ok)
                        resolve("Participant added")
                    else reject(result);                    
                })    
            },
            error => { console.log("not updated") })    
            .then( msg => {                
                this.props.onHide();
            },
            error => {
                error.json()
                .then((text) => {                    
                    alert(text.message);
                })                
            })
        }
        else alert("Please choose one person.");
    }

    render()
    {   
        return (
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <Modal 
                    show={this.props.show}                
                    onHide={this.props.onHide}
                    onEnter={() => this.handleClearForm()}                
                    animation="true"
                    size="lg"
                    centered="true"                
                >
                <Form onSubmit={this.handleSignUp}>
                    <Modal.Header>
                        Add a participant
                    </Modal.Header>
                    <Modal.Body>                        
                        <Container>
                            <Form.Group as={Row}>
                                <Form.Label column sm="4">Select a person: </Form.Label>
                            </Form.Group>
                            <CrudTableComponent itemsUrl={USERS_API_URL} 
                                                tableColumns={columns} 
                                                selectedItemId={this.handleRowClick}
                                                selectedIds={this.handleRowSelection}                                                
                            />                         
                        </Container>                        
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <Button variant="info" type="submit">Save</Button>{' '}                            
                            <Button variant="secondary" onClick={this.props.onHide}>Cancel</Button>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
            ): (<h2>You do not have priviledges  granted to view this section.</h2 >)
        );
    }
}

export default AddParticipantToExamModal;