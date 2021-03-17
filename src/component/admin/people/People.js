import React, {Component} from "react";
import CrudTableComponent from "../../CrudTableComponent";
import {
    Card,
    Form,    
    Col,    
    Button
} from "react-bootstrap";
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { withTranslation } from "react-i18next";
import InformationDialogModal from "../../InformationDialogModal";
import ConfirmationDialogModal from "../../ConfirmationDialogModal";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();
const USERS_URL = Urls.WEBSERVICE_URL + "/users";

const Columns = Object.freeze ({
    ID: 0,
    FULL_NAME: 1,
    EMAIL: 2,
    COUNTRY: 3,
    CLUB: 4,
});

const searchableHeaderFormatter = (column, colIndex, { sortElement, filterElement }) => {
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
    },
    {            
        dataField: "country",
        text: "",
        sort: true,
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter,
    },
    {            
        dataField: "club.clubName",
        text: "",
        sort: true,
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter,
    }
];


class People extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            selectedRowsIds: [],
            showInformationModal: false,
            showConfirmationModal: false
        }
        
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.handleRemoveProfile = this.handleRemoveProfile.bind(this);        
        this.askForProfileRemoving = this.askForProfileRemoving.bind(this);

        this.crudTableRef = React.createRef();
    }

    handleRowClick(selectedRowId)
    {
        this.setState({ selectedRowsIds: selectedRowId });
        this.props.history.push("/person_component/" + selectedRowId[0]);
    }

    handleRowSelection(selectedRows)
    {
        this.setState({ selectedRowsIds: selectedRows });
    }

    askForProfileRemoving()
    {
        this.setState({ showConfirmationModal: true });
    }

    handleRemoveProfile(result)
    {
        const t = this.props.t;
        
        if ( this.state.selectedRowsIds != null && this.state.selectedRowsIds.length == 1 )
        {                    
            const EXAM_REGISTRATIONS_OF_PERSON_URL = Urls.WEBSERVICE_URL + "/users/" + this.state.selectedRowsIds[0] + "/exam_registrations";
            const CAMP_REGISTRATIONS_OF_PERSON_URL = Urls.WEBSERVICE_URL + "/users/" + this.state.selectedRowsIds[0] + "/camp_registrations";
            const TOURNAMENT_REGISTRATIONS_OF_PERSON_URL = Urls.WEBSERVICE_URL + "/users/" + this.state.selectedRowsIds[0] + "/tournament_registrations";
            const TEAMS_OF_PERSON_URL = Urls.WEBSERVICE_URL + "/user/" + this.state.selectedRowsIds[0] + "/teams";
            
            let requests = [];

            const OptionsNames = Object.freeze({            
                EXAM_REGISTRATIONS_OF_PERSON: 0,
                CAMP_REGISTRATIONS_OF_PERSON: 1,
                TOURNAMENT_REGISTRATIONS_OF_PERSON: 2,
                TEAMS_OF_PERSON: 3
            });
            
            let requestHeader = {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + currentUser.accessToken
                }
            };
            
            requests.push(fetch(EXAM_REGISTRATIONS_OF_PERSON_URL, requestHeader));
            requests.push(fetch(CAMP_REGISTRATIONS_OF_PERSON_URL, requestHeader));
            requests.push(fetch(TOURNAMENT_REGISTRATIONS_OF_PERSON_URL, requestHeader));
            requests.push(fetch(TEAMS_OF_PERSON_URL, requestHeader));

            Promise.all(requests)
            .then(responses => responses.map(response => response.json()))
            .then(jsonResponses => {
                Promise.all(jsonResponses)
                .then(data => {
                    if (data[OptionsNames.EXAM_REGISTRATIONS_OF_PERSON].length == 0 &&
                        data[OptionsNames.CAMP_REGISTRATIONS_OF_PERSON].length == 0 &&
                        data[OptionsNames.TOURNAMENT_REGISTRATIONS_OF_PERSON].length == 0 &&
                        data[OptionsNames.TEAMS_OF_PERSON].length == 0)
                    {
                        if (result)
                        {                
                            fetch(USERS_URL + "/" + this.state.selectedRowsIds[0], {
                                method: "DELETE",
                                headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer " + currentUser.accessToken
                                }                
                            })
                            .then(result => {
                                if(result.ok) 
                                    this.crudTableRef.current.fillTable() 
                                else return result.json();                            
                            },
                            error => {this.setState({ errorMessage: error.message })})
                            .then(result => {
                                if(typeof result != "undefined")                   
                                    this.setState({ errorMessage: t(result.message) });
                            });     
                        }
                    }
                    else this.setState({ showInformationModal: true }, () => this.crudTableRef.current.unselectAllRows());
                })
            })            
        }
        else alert(t("select_one_person_to_remove"));
    }

    render()
    {
        const t = this.props.t;

        columns[Columns.FULL_NAME] = {...columns[Columns.FULL_NAME], text: t("full_name"), filter: textFilter({ placeholder: t("enter_full_name")})};
        columns[Columns.EMAIL] = {...columns[Columns.EMAIL], text: t("email"), filter: textFilter({ placeholder: t("enter_email")})};
        columns[Columns.COUNTRY] = {...columns[Columns.COUNTRY], text: t("country"), filter: textFilter({ placeholder: t("enter_country")})};
        columns[Columns.CLUB] = {...columns[Columns.CLUB], text: t("club"), filter: textFilter({ placeholder: t("enter_club")})};
        
        this.props.navbarControlsHandler();        

        return(
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <div>
                    <ConfirmationDialogModal    show={this.state.showConfirmationModal}
                                                onHide={() => this.setState({ showConfirmationModal: false }) }
                                                confirmationResult={this.handleRemoveProfile}                                                
                    />
                    <InformationDialogModal modalContent={t("cannot_remove_person")} 
                                            show={this.state.showInformationModal}
                                            onHide={() => {
                                                this.setState({ showInformationModal: false });
                                                //window.location.reload();   
                                            }} 
                    />
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                <CrudTableComponent itemsUrl={USERS_URL} 
                                                    tableColumns={columns} 
                                                    selectedItemId={this.handleRowClick} 
                                                    selectedIds={this.handleRowSelection}
                                                    ref={this.crudTableRef}
                                />             
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                
            ) :
            ( <h2>You do not have priviledges  granted to view this section.</h2> )
        );
    }
}

export default withTranslation('translation', { withRef: true })(People);