import React, {Component} from "react";
import {
    Modal, 
    Form,
    Button,
    Row,
    Card,
    Alert
    } from "react-bootstrap";
import CrudTableComponent from "../../CrudTableComponent";
import { textFilter } from 'react-bootstrap-table2-filter';
import {withRouter} from "react-router-dom";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();
const TRAINERS = Urls.WEBSERVICE_URL + "/roles/ROLE_TRAINER/users"; 

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
    {
        dataField: "email", 
        text: "Email",
        sort: false,        
        filter: textFilter(),                       
    },
    {            
        dataField: "club.clubName",
        text: "Club",
        sort: true,
        filter: textFilter(),
    },
    {            
        dataField: "country",
        text: "Country",
        sort: true,
        filter: textFilter(),
    },
    
];

const sizePerPageList = {
    sizePerPageList: [ 
        {
            text: '3rd', value: 3
        },
        {
            text: '6th', value: 6
        },
        {
            text: '12th', value: 12
        }
    ]
};


class AddTeamModal extends Component
{
    constructor(props)
    {        
        super(props);
        this.state = {                        
            selectedRowsIds: [],
            errorMessage: false,
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
        this.setState({ selectedRowsIds: [] });
    }
    
    handleSignUp(e)
    {
        e.preventDefault();
        
        if ( this.state.selectedRowsIds.length == 1 )
        {   
            let team = {
                trainer: {
                    id: this.state.selectedRowsIds[0]
                },
                tournamentRegistrations: []
            };
            
            fetch(Urls.WEBSERVICE_URL + "/tournament_events/" + this.props.eventId + "/teams", {
                method: "POST",
                headers : {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(team)
            })            
            .then(result => {            
                return new Promise((resolve, reject) => {
                    if(result.ok)
                        resolve(result)
                    else reject(result);                    
                })    
            },
            error => { console.log("Error - Participant not added.") })    
            .then( result => {
                result.json()
                .then(savedTeam => this.props.history.push("/user/" + this.state.selectedRowsIds[0] + "/team_component/" + savedTeam.id)) 
            },
            error => {
                error.json()
                .then(text => this.setState({ errorMessage: text.message }) );                
            }); 
        }
        else this.setState({ errorMessage: "Please choose one person." });        
    }

    render()
    {
        const selectStyles = {
            container: base => ({
                ...base,
                flex: 1,                
            })
        };

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
                        ADD TEAM
                    </Modal.Header>
                    <Modal.Body>
                        <Card>
                            <Card.Header>TRAINER</Card.Header>
                            <Card.Body>
                                                  
                                <Form.Group as={Row}>
                                    <Form.Label column sm="12">Select a trainer for whom you want to create a team: </Form.Label>
                                </Form.Group>
                                {this.state.errorMessage && (<Alert variant="danger">{this.state.errorMessage}</Alert>)}      
                                <CrudTableComponent itemsUrl={TRAINERS} 
                                                    tableColumns={columns} 
                                                    selectedItemId={this.handleRowClick}
                                                    selectedIds={this.handleRowSelection}  
                                                    sizePerPageList={sizePerPageList}                                              
                                />                         
                            </Card.Body>                
                        </Card>
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

export default withRouter(AddTeamModal);