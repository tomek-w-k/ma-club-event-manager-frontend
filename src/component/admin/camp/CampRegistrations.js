import React, {Component} from "react";
import CrudTableComponent from "../../CrudTableComponent";
import {
    Card,
    Alert
} from "react-bootstrap";
import { textFilter } from 'react-bootstrap-table2-filter';
import EditCampRegistrationModal from "./EditCampRegistrationModal";
import AddParticipantToCampModal from "./AddParticipantToCampModal";
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";
import { ColumnNames } from "./campRegistrationsTableColumnDefs";
import { campRegistrationsTableColumnDefs as columns } from "./campRegistrationsTableColumnDefs";


const currentUser = AuthService.getCurrentUser();
const CAMP_REGISTRATIONS = Urls.WEBSERVICE_URL + "/camp_registrations";
const CAMP_EVENTS = Urls.WEBSERVICE_URL + "/camp_events";


class CampRegistrations extends Component
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
        fetch(CAMP_EVENTS + "/" + this.props.id, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        })
        .then(response => response.json())        
        .then(data => {
            let sayonaraColumnDef = Object.assign(columns[ColumnNames.SAYONARA], { hidden: !data.sayonaraMeeting });
            let accommodationColumnDef = Object.assign(columns[ColumnNames.ACCOMMODATION], { hidden: !data.accommodation});

            columns[ColumnNames.SAYONARA] = sayonaraColumnDef;
            columns[ColumnNames.ACCOMMODATION] = accommodationColumnDef;
            
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
        const t = this.props.t;
        
        if ( this.state.selectedRowsIds.length == 1 )
        {
            if ( !window.confirm("Are you sure?") )
                return;

            fetch(CAMP_REGISTRATIONS + "/" + this.state.selectedRowsIds[0], {
                method: "DELETE",
                headers : {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + currentUser.accessToken
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
        else alert(t("select_one_participant_to_remove"));
    }

    render()
    {
        const CAMP_REGISTRATIONS_FOR_CAMP = Urls.WEBSERVICE_URL + "/camp_events/" + this.props.id + "/camp_registrations";
        const t = this.props.t;

        columns[ColumnNames.FULL_NAME] = {...columns[ColumnNames.FULL_NAME], text: t("full_name"), filter: textFilter({ placeholder: t("enter_full_name")})};
        columns[ColumnNames.EMAIL] = {...columns[ColumnNames.EMAIL], text: t("email"), filter: textFilter({ placeholder: t("enter_email")})};
        columns[ColumnNames.CLUB] = {...columns[ColumnNames.CLUB], text: t("club"), filter: textFilter({ placeholder: t("enter_club")})};
        columns[ColumnNames.FEE_RECEIVED] = {...columns[ColumnNames.FEE_RECEIVED], text: t("fee_received")};
        columns[ColumnNames.SAYONARA] = {...columns[ColumnNames.SAYONARA], text: t("sayonara")};
        columns[ColumnNames.CLOTHING_SIZE] = {...columns[ColumnNames.CLOTHING_SIZE], text: t("clothing_size"), filter: textFilter({ placeholder: t("enter_clothing_type")})};
        columns[ColumnNames.ACCOMMODATION] = {...columns[ColumnNames.ACCOMMODATION], text: t("accommodation")};

        
        return(            
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <div>
                    <EditCampRegistrationModal  show={this.state.editModalShow}
                                                onHide={() => {
                                                    this.setState({ editModalShow: false, selectedRowsIds: [] });
                                                    this.crudTableRef.current.unselectAllRows();
                                                    this.crudTableRef.current.fillTable();
                                                    this.props.onRegistrationUpdate();
                                                }}
                                                itemId={this.state.selectedRowsIds[0]}
                                                eventId={this.props.id}
                    />              
                    <AddParticipantToCampModal  show={this.state.addModalShow}
                                                onHide={() => {
                                                    this.setState({ addModalShow: false, selectedRowsIds: [] });
                                                    this.crudTableRef.current.unselectAllRows();
                                                    this.crudTableRef.current.fillTable();                                                    
                                                }}
                                                itemId={this.state.selectedRowsIds[0]}
                                                eventId={this.props.id}
                                                sayonaraMeeting={this.state.sayonaraMeeting}
                    />                     
                    <Card>                        
                        <Card.Body>
                            <Card.Text>
                                <CrudTableComponent itemsUrl={CAMP_REGISTRATIONS_FOR_CAMP} 
                                                    tableColumns={columns} 
                                                    selectedItemId={this.handleRowClick}
                                                    selectedIds={this.handleRowSelection}
                                                    ref={this.crudTableRef}
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

export default withTranslation('translation', { withRef: true })(CampRegistrations);