import React, {Component} from "react";
import CrudTableComponent from "../../CrudTableComponent";
import {
    Card,    
    Alert
} from "react-bootstrap";
import { textFilter } from 'react-bootstrap-table2-filter';
import EditTournamentRegistrationModal from "./EditTournamentRegistrationModal";
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";
import { ColumnNames } from "./tournamentRegistrationsTableColumnDefs";
import { tournamentRegistrationsTableColumnDefs as columns } from "./tournamentRegistrationsTableColumnDefs";


const currentUser = AuthService.getCurrentUser();
const TOURNAMENT_REGISTRATIONS = Urls.WEBSERVICE_URL + "/tournament_registrations";
const TOURNAMENT_EVENTS = Urls.WEBSERVICE_URL + "/tournament_events";


class TournamentRegistrations extends Component
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
        this.fillTable = this.fillTable.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);

        this.crudTableRef = React.createRef();
    }

    componentDidMount()
    {
        fetch(TOURNAMENT_EVENTS + "/" + this.props.id, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
         })
        .then(response => response.json())        
        .then(data => {            
            columns[ColumnNames.SAYONARA] = {...columns[ColumnNames.SAYONARA],  hidden: !data.sayonaraMeeting };
            columns[ColumnNames.ROOM_TYPE_NAME] = {...columns[ColumnNames.ROOM_TYPE_NAME], hidden: !data.accommodation};
            columns[ColumnNames.STAY_PERIOD_NAME] = {...columns[ColumnNames.STAY_PERIOD_NAME], hidden: !data.accommodation};
            
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

    fillTable()
    {
        this.crudTableRef.current.fillTable();
    }

    handleDeleteItem()
    {
        const t = this.props.t;

        if ( this.state.selectedRowsIds.length == 1 )
        {
            if ( !window.confirm("Are you sure?") )
                return;

            fetch(TOURNAMENT_REGISTRATIONS + "/" + this.state.selectedRowsIds[0], {
                method: "DELETE",
                headers: {
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
        const TOURNAMENT_REGISTRATIONS_FOR_TOURNAMENT = Urls.WEBSERVICE_URL + "/tournament_events/" + this.props.id + "/tournament_registrations";
        const t = this.props.t;

        columns[ColumnNames.FULL_NAME] = {...columns[ColumnNames.FULL_NAME], text: t("full_name"), filter: textFilter({ placeholder: t("enter_full_name")})};
        columns[ColumnNames.TRAINER] = {...columns[ColumnNames.TRAINER], text: t("trainer"), filter: textFilter({ placeholder: t("enter_email")})};
        columns[ColumnNames.CLUB] = {...columns[ColumnNames.CLUB], text: t("club"), filter: textFilter({ placeholder: t("enter_club")})};
        columns[ColumnNames.FEE_RECEIVED] = {...columns[ColumnNames.FEE_RECEIVED], text: t("fee_received")};
        columns[ColumnNames.SAYONARA] = {...columns[ColumnNames.SAYONARA], text: t("sayonara")};
        columns[ColumnNames.AS_JUDGE_PARTICIPATION] = {...columns[ColumnNames.AS_JUDGE_PARTICIPATION], text: t("as_judge")};
        columns[ColumnNames.ROOM_TYPE_NAME] = {...columns[ColumnNames.ROOM_TYPE_NAME], text: t("room_type"), filter: textFilter({ placeholder: t("enter_room_type")})};
        columns[ColumnNames.STAY_PERIOD_NAME] = {...columns[ColumnNames.STAY_PERIOD_NAME], text: t("stay_period"), filter: textFilter({ placeholder: t("enter_stay_period")})};
        columns[ColumnNames.CATEGORY_NAME] = {...columns[ColumnNames.CATEGORY_NAME], text: t("weight_age_category"), filter: textFilter({ placeholder: t("enter_category")})};

        return(            
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <div>
                    <EditTournamentRegistrationModal    show={this.state.editModalShow}
                                                        onHide={() => {
                                                            this.setState({ editModalShow: false, selectedRowsIds: [] });
                                                            this.crudTableRef.current.unselectAllRows();
                                                            this.fillTable();
                                                            this.props.onRegistrationUpdate();
                                                        }}
                                                        itemId={this.state.selectedRowsIds[0]}
                                                        eventId={this.props.id}
                                                        sayonaraMeeting={this.state.sayonaraMeeting}
                                                        accommodation={this.state.accommodation}
                    />
                    <Card>                        
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

export default withTranslation('translation', { withRef: true })(TournamentRegistrations);