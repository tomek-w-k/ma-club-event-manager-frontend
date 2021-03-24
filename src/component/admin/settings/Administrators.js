import React, { Component } from "react";
import {
    Alert,
    Card,    
} from "react-bootstrap";
import { withTranslation } from "react-i18next";
import CrudTableComponent from "../../CrudTableComponent";
import { textFilter } from 'react-bootstrap-table2-filter';
import InformationDialogModal from "../../InformationDialogModal";
import ConfirmationDialogModal from "../../ConfirmationDialogModal";
import AddAdminPrivilegesModal from "./AddAdminPrivilegesModal";
import AuthService from "../../../service/auth-service";
import * as SettingsConstants from "./settingsConstants";
import { handleFetchErrors } from "../../../utils/handleFetchErrors";
import { searchableHeaderFormatter } from "../../../utils/searchableHeaderFormatter";
import { fetchMetadataForGet } from "../../../utils/fetchMetadata";


const currentUser = AuthService.getCurrentUser();


const AdministratorsTableColumnNames = Object.freeze ({
    ID: 0,
    FULL_NAME: 1,
    EMAIL: 2
});

const administratorsTableColumns = [
    {
        dataField: "id",
        sort: false,
        hidden: true
    },
    {
        dataField: "fullName",
        text: "",
        sort: true, 
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter,
    },
    {
        dataField: "email", 
        text: "",
        sort: false,        
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter,                     
    }
];


class Administrators extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            
            selectedAdminsTableRowsIds: [],            
            showInformationModal: false,            
            showAddAdminPrivilegesModal: false,  
            showConfirmRemoveAdminPrivilegesModal: false,            
            popupErrorMessage: "", 
        } 

        this.handleAdminsTableRowClick = this.handleAdminsTableRowClick.bind(this);
        this.handleAdminsTableRowSelection = this.handleAdminsTableRowSelection.bind(this);
        this.refreshTable = this.refreshTable.bind(this);
        this.handleManageAdminPrivileges = this.handleManageAdminPrivileges.bind(this);    
        this.handleRemoveAdminPrivileges = this.handleRemoveAdminPrivileges.bind(this);
        
        this.adminsTableRef = React.createRef();
    }

    handleAdminsTableRowClick(selectedRowId)
    {
        this.setState({ selectedAdminsTableRowsIds: selectedRowId });
    }

    handleAdminsTableRowSelection(selectedRows)
    {
        this.setState({ selectedAdminsTableRowsIds: selectedRows } );        
    }

    refreshTable()
    {
        this.setState({ selectedAdminsTableRowsIds: [] }); 
        this.adminsTableRef.current.unselectAllRows();                             
        this.adminsTableRef.current.fillTable();
    }

    handleManageAdminPrivileges(addAdminPrivileges)
    {
        const t = this.props.t;
        
        if (addAdminPrivileges)
            this.setState({ showAddAdminPrivilegesModal: true });
        else 
            if ( this.state.selectedAdminsTableRowsIds.length == 1 ) 
            {
                if ( this.state.selectedAdminsTableRowsIds[0] == currentUser.id ) 
                { 
                    this.setState({ 
                        popupErrorMessage: t("cannot_remove_currently_logged_in_admin"),
                        showInformationModal: true
                     });
                    this.refreshTable();                
                    return;
                }  
                this.setState({ showConfirmRemoveAdminPrivilegesModal: true });
            }            
            else            
                this.setState({
                        popupErrorMessage: t("select_one_person_to_remove"),
                        showInformationModal: true
                    });                    
    }

    handleRemoveAdminPrivileges(confirmed)
    {
        const t = this.props.t;

        if ( !confirmed )
        {
            this.refreshTable(); 
            return;
        }

        fetch(SettingsConstants.USERS_URL + this.state.selectedAdminsTableRowsIds[0], fetchMetadataForGet(currentUser))
        .then(response => response.json())
        .then(user => {
            fetch(SettingsConstants.ROLES_URL + "ROLE_ADMIN")
            .then(response => response.json())
            .then(roleAdmin => {
                let rolesWithoutAdmin = user.roles.filter(role => role.id !== roleAdmin.id);
                user = {...user, roles: rolesWithoutAdmin};                    
                
                fetch(SettingsConstants.ADMINISTRATORS, {
                    method: "PUT",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + currentUser.accessToken
                    },
                    body: JSON.stringify( user )
                })
                .then(handleFetchErrors)
                .then(() => this.refreshTable())
                .catch(error => this.setState({ popupErrorMessage: t("failed_to_remove_admin"), showInformationModal: true })  );            
            })
        })
        .catch(error => this.setState({ popupErrorMessage: t("failed_to_remove_admin"), showInformationModal: true })  );        
    }

    render()
    {
        const t = this.props.t;

        administratorsTableColumns[AdministratorsTableColumnNames.FULL_NAME] = 
            {...administratorsTableColumns[AdministratorsTableColumnNames.FULL_NAME], text: t("full_name"), filter: textFilter({ placeholder: t("enter_full_name")})};
        administratorsTableColumns[AdministratorsTableColumnNames.EMAIL] = 
            {...administratorsTableColumns[AdministratorsTableColumnNames.EMAIL], text: t("email"), filter: textFilter({ placeholder: t("enter_email")})};

        return (
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <div>
                    <AddAdminPrivilegesModal    show={this.state.showAddAdminPrivilegesModal}
                                                onHide={() => {
                                                    this.setState({ showAddAdminPrivilegesModal: false });                                                    
                                                    this.adminsTableRef.current.fillTable();                                                    
                                                }}                                                                                               
                    />
                    <InformationDialogModal     modalContent={this.state.popupErrorMessage} 
                                                show={this.state.showInformationModal}
                                                onHide={() => this.setState({ 
                                                    popupErrorMessage: "",
                                                    showInformationModal: false,
                                                })} 
                    />
                    <ConfirmationDialogModal    show={this.state.showConfirmRemoveAdminPrivilegesModal}
                                                onHide={() => this.setState({ showConfirmRemoveAdminPrivilegesModal: false }) }
                                                confirmationResult={this.handleRemoveAdminPrivileges}                                                
                    />
                    <Card style={{flex: "auto"}}>                        
                        <Card.Body>
                            <Card.Text>
                                <CrudTableComponent itemsUrl={SettingsConstants.ADMINISTRATOR_USERS_URL} 
                                                    tableColumns={administratorsTableColumns} 
                                                    selectedItemId={this.handleAdminsTableRowClick} 
                                                    selectedIds={this.handleAdminsTableRowSelection}
                                                    ref={this.adminsTableRef}
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
        );
    }
}

export default withTranslation('translation', { withRef: true })(Administrators);