import React, {Component} from "react";
import {
    Modal, 
    Form,
    Button,
    Row,
    Container,
    Alert
} from "react-bootstrap";
import CrudTableComponent from "../../CrudTableComponent";
import { textFilter } from 'react-bootstrap-table2-filter';
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";
import { ColumnNames } from "./addParticipantToExamTableColumnDefs";
import { addParticipantToExamTableColumnDefs as columns} from "./addParticipantToExamTableColumnDefs";


const currentUser = AuthService.getCurrentUser();
const USERS_API_URL = Urls.WEBSERVICE_URL + "/users";
const EXAM_REGISTRATIONS = Urls.WEBSERVICE_URL + "/exam_registrations"; 


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

        const t = this.props.t;
        
        if ( this.state.selectedRowsIds.length == 1 )
        {  
            let examRegistration = {...this.state.examRegistration, user: {id: this.state.selectedRowsIds[0]}};
            fetch(EXAM_REGISTRATIONS, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + currentUser.accessToken
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
            error => console.log("not updated"))    
            .then(
                msg => this.props.onHide(),
                error => error.json().then(text => alert(text.message))                
            )
        }
        else alert(t("choose_one_person"));
    }

    render()
    {   
        const t = this.props.t;

        columns[ColumnNames.FULL_NAME] = {...columns[ColumnNames.FULL_NAME], text: t("full_name"), filter: textFilter({ placeholder: t("enter_full_name")})};
        columns[ColumnNames.COUNTRY] = {...columns[ColumnNames.COUNTRY], text: t("country"), filter: textFilter({ placeholder: t("enter_country")})};
        columns[ColumnNames.CLUB] = {...columns[ColumnNames.CLUB], text: t("club"), filter: textFilter({ placeholder: t("enter_club")})};

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
                    <Modal.Header>{t("add_participant_capital")}</Modal.Header>
                    <Modal.Body>                        
                        <Container>
                            <Form.Group as={Row}>
                                <Form.Label column sm="4">{t("select_a_person")}</Form.Label>
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
                            <Button variant="info" type="submit">{t("save")}</Button>{' '}                            
                            <Button variant="secondary" onClick={this.props.onHide}>{t("cancel")}</Button>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
            ) : (
                <Alert variant="danger">
                    <Alert.Heading>Access denided</Alert.Heading>
                    <p>You have no priviledges granted to view this section.</p>
                </Alert>
            )
        );
    }
}

export default withTranslation('translation', { withRef: true })(AddParticipantToExamModal);