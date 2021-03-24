import React, { Component } from "react";
import {
    Alert,    
    Row,    
    Form,
    Button,
    Modal, 
    Container
} from "react-bootstrap";
import { withTranslation } from "react-i18next";
import CrudTableComponent from "../../CrudTableComponent";
import { textFilter } from 'react-bootstrap-table2-filter';
import AuthService from "../../../service/auth-service";
import * as SettingsConstants from "./settingsConstants";
import { fetchMetadataForGet } from "../../../utils/fetchMetadata";


const currentUser = AuthService.getCurrentUser();

const Columns = Object.freeze ({
    ID: 0,
    FULL_NAME: 1,
    EMAIL: 2,
    CLUB: 3,    
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
        text: "",
        sort: false,        
        filter: textFilter(),
        headerFormatter: headerFormatter,                     
    },
    {            
        dataField: "club.clubName",
        text: "Club",
        sort: true,
        filter: textFilter(),
        headerFormatter: headerFormatter
    }
];


class AddAdminPrivilegesModal extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {                        
            selectedRowsIds: [],
            errorMessage: ""
        } 
        
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.handleAddAdminPrivileges = this.handleAddAdminPrivileges.bind(this);
    }

    handleRowClick(selectedRowsIds)
    {
        this.setState({ selectedRowsIds: selectedRowsIds });
    }

    handleRowSelection(selectedRowsIds)
    {
        this.setState({ selectedRowsIds: selectedRowsIds });
    }

    handleClearForm()
    {
        this.setState({ 
            selectedRowsIds: [],
            errorMessage: ""
        });
    }

    handleAddAdminPrivileges(e)
    {        
        e.preventDefault();
        const t = this.props.t;

        if ( this.state.selectedRowsIds.length != 1 )
        {            
            this.setState({ errorMessage: t("choose_one_person") });
            return;
        }            

        fetch(SettingsConstants.USERS_URL + this.state.selectedRowsIds[0], fetchMetadataForGet(currentUser))
        .then(response => response.json())
        .then(user => {
            fetch(SettingsConstants.ROLES_URL + "ROLE_ADMIN")
            .then(response => response.json())
            .then(roleAdmin => {
                user.roles = [...user.roles, roleAdmin];

                fetch(SettingsConstants.ADMINISTRATORS, {
                    method: "PUT",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + currentUser.accessToken
                    },
                    body: JSON.stringify( user )
                })
                .then(result => {
                    if (result.ok) {
                        this.setState({ selectedRowsIds: [] });
                        this.props.onHide();
                    } else return result.json();
                }, 
                error => this.state({ errorMessage: error.message }))                
            })
        })
        .catch(result => {
            if(typeof result != "undefined")                   
                this.setState({ errorMessage: result.message });
        })
    }

    render()
    {
        const t = this.props.t;

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
                    <Form onSubmit={this.handleAddAdminPrivileges}>
                        <Modal.Header>{t("add_admin_capital")}</Modal.Header>
                        <Modal.Body>                        
                            <Container>
                                {this.state.errorMessage && (<Alert variant="danger">{this.state.errorMessage}</Alert>)}
                                <Form.Group as={Row}>
                                    <Form.Label column sm="4">{t("select_a_person")}</Form.Label>
                                </Form.Group>
                                <CrudTableComponent itemsUrl={SettingsConstants.NON_ADMINISTRATOR_USERS_URL} 
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

export default withTranslation('translation', { withRef: true })(AddAdminPrivilegesModal);