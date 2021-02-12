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
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();
const TRAINERS = Urls.WEBSERVICE_URL + "/roles/ROLE_TRAINER/users"; 

const ColumnNames = Object.freeze({
    ID: 0,    
    FULL_NAME: 1,
    EMAIL: 2,
    CLUB: 3,
    COUNTRY: 4
});

const headerFormatter = (column, colIndex, { sortElement, filterElement }) => {
    return (
        <div style={ { display: 'flex', flexDirection: 'column' } }>            
            { column.text }            
            { filterElement }
            { sortElement }
        </div>
    );
};

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
        filter: textFilter(),
        headerFormatter: headerFormatter          
    },
    {
        dataField: "email", 
        text: "Email",
        sort: false,        
        filter: textFilter(), 
        headerFormatter: headerFormatter                      
    },
    {            
        dataField: "club.clubName",
        text: "Club",
        sort: true,
        filter: textFilter(),
        headerFormatter: headerFormatter
    },
    {            
        dataField: "country",
        text: "Country",
        sort: true,
        filter: textFilter(),
        headerFormatter: headerFormatter
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

        const t = this.props.t;
        
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
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + currentUser.accessToken
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
        else this.setState({ errorMessage: t("choose_one_person") });        
    }

    render()
    {
        const selectStyles = {
            container: base => ({
                ...base,
                flex: 1,                
            })
        };

        const t = this.props.t;

        columns[ColumnNames.FULL_NAME] = {...columns[ColumnNames.FULL_NAME], text: t("full_name"), filter: textFilter({ placeholder: t("enter_full_name")})};
        columns[ColumnNames.EMAIL] = {...columns[ColumnNames.EMAIL], text: t("email"), filter: textFilter({ placeholder: t("enter_email")})};
        columns[ColumnNames.CLUB] = {...columns[ColumnNames.CLUB], text: t("club"), filter: textFilter({ placeholder: t("enter_club")})};
        columns[ColumnNames.COUNTRY] = {...columns[ColumnNames.COUNTRY], text: t("country"), filter: textFilter({ placeholder: t("enter_country")})};

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
                    <Modal.Header>{t("add_team_capital")}</Modal.Header>
                    <Modal.Body>
                        <Card>
                            <Card.Header>{t("trainer_capital")}</Card.Header>
                            <Card.Body>                                                  
                                <Form.Group as={Row}>
                                    <Form.Label column sm="12">{t("select_a_trainer_for_whom")}</Form.Label>
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

export default withTranslation('translation', { withRef: true })(withRouter(AddTeamModal))
