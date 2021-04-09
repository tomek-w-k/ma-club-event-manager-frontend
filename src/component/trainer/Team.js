import React, {Component} from "react";
import CrudTableComponent from "../CrudTableComponent";
import {
    Card,
    Alert
} from "react-bootstrap";
import {textFilter} from 'react-bootstrap-table2-filter';
import EditTournamentRegistrationInTeamModal from "./EditTournamentRegistrationInTeamModal";
import AddParticipantToTeamModal from "./AddParticipantToTeamModal";
import { withTranslation } from "react-i18next";
import AuthService from "../../service/auth-service";
import * as Urls from "../../servers-urls";
import { ColumnNames } from "./teamTableColumnDefs";
import { teamTableColumnDefs as columns} from "./teamTableColumnDefs";


const currentUser = AuthService.getCurrentUser();


class Team extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            editModalShow: false,
            addModalShow: false,            
            signUpMe: false,
            selectedRowsIds: [],            
            team: null,
            eventId: null,
            teamId: null,
            sayonaraMeeting: false,
            accommodation: false,
            stateUpdated: false,            
        };

        this.handleShowAddParticipantToTeamModal = this.handleShowAddParticipantToTeamModal.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.handleDeleteRegistration = this.handleDeleteRegistration.bind(this);

        this.crudTableRef = React.createRef();
    }

    componentDidMount()
    {
        fetch(Urls.WEBSERVICE_URL + "/teams/" + this.props.match.params.teamId, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        })
        .then(response => response.json())
        .then(teamData => {
            fetch(Urls.WEBSERVICE_URL + "/tournament_events/" + teamData.eventId, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + currentUser.accessToken
                }
            })
            .then(response => response.json())        
            .then(eventData => {            
                columns[ColumnNames.SAYONARA_MEETING_PARTICIPATION] = {...columns[ColumnNames.SAYONARA_MEETING_PARTICIPATION],  hidden: !eventData.sayonaraMeeting };
                columns[ColumnNames.ROOM_TYPE_NAME] = {...columns[ColumnNames.ROOM_TYPE_NAME], hidden: !eventData.accommodation};
                columns[ColumnNames.STAY_PERIOD_NAME] = {...columns[ColumnNames.STAY_PERIOD_NAME], hidden: !eventData.accommodation};
                
                this.setState({ 
                    team: teamData,
                    eventId: eventData.id,
                    teamId: teamData.id,
                    sayonaraMeeting: eventData.sayonaraMeeting,
                    accommodation: eventData.accommodation,
                    stateUpdated: true                    
                });                                           
            });            
        });
    }

    handleShowAddParticipantToTeamModal(signUpMe)
    {        
        if ( signUpMe )        
            this.setState({ 
                addModalShow: true,
                signUpMe: true
            });
        else
            this.setState({ 
                addModalShow: true,
                signUpMe: false
            });
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

    handleDeleteRegistration()
    {
        const t = this.props.t;
        
        if ( this.state.selectedRowsIds.length == 1 )
        {
            if ( !window.confirm("Are you sure?") )
                return;

            fetch(Urls.WEBSERVICE_URL + "/tournament_registrations/" + this.state.selectedRowsIds[0], {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + currentUser.accessToken
                }
            })
            .then(response => response.json())
            .then(result => {
                if (result.feeReceived == true && !currentUser.roles.includes("ROLE_ADMIN"))
                    alert(t("changing_registration_options_not_allowed"))
                else
                {
                    fetch(Urls.WEBSERVICE_URL + "/tournament_registrations/" + this.state.selectedRowsIds[0], {
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
            })
        }
        else alert(t("select_one_participant_to_remove"));
    }

    render()
    {
        const TOURNAMENT_REGISTRATIONS_FOR_TEAM = Urls.WEBSERVICE_URL + "/teams/" + this.props.match.params.teamId + "/tournament_registrations";
        const t = this.props.t;

        columns[ColumnNames.FULL_NAME] = {...columns[ColumnNames.FULL_NAME], text: t("full_name"), filter: textFilter({ placeholder: t("enter_full_name")})};        
        columns[ColumnNames.CLUB_NAME] = {...columns[ColumnNames.CLUB_NAME], text: t("club"), filter: textFilter({ placeholder: t("enter_club")})};
        columns[ColumnNames.FEE_RECEIVED] = {...columns[ColumnNames.FEE_RECEIVED], text: t("fee_received")};
        columns[ColumnNames.SAYONARA_MEETING_PARTICIPATION] = {...columns[ColumnNames.SAYONARA_MEETING_PARTICIPATION], text: t("sayonara")};
        columns[ColumnNames.AS_JUDGE_PARTICIPATION] = {...columns[ColumnNames.AS_JUDGE_PARTICIPATION], text: t("as_judge")};
        columns[ColumnNames.ROOM_TYPE_NAME] = {...columns[ColumnNames.ROOM_TYPE_NAME], text: t("room_type"), filter: textFilter({ placeholder: t("enter_room_type")})};
        columns[ColumnNames.STAY_PERIOD_NAME] = {...columns[ColumnNames.STAY_PERIOD_NAME], text: t("stay_period"), filter: textFilter({ placeholder: t("enter_stay_period")})};
        columns[ColumnNames.CATEGORY_NAME] = {...columns[ColumnNames.CATEGORY_NAME], text: t("weight_age_category"), filter: textFilter({ placeholder: t("enter_category")})};

        const emptyTableMessage = () => <div>{t("empty_team_table_message_part_1")}<br />{t("empty_team_table_message_part_2")}</div> 

        this.props.navbarControlsHandler();        

        return (        
            this.state.stateUpdated && (
                currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ||
                                        (this.state.team.trainer.id == currentUser.id && currentUser.roles.includes("ROLE_TRAINER")) ? 
                (
                    <div>
                        {this.state.eventId !=null ? (
                            <div>
                                <EditTournamentRegistrationInTeamModal  show={this.state.editModalShow}
                                                                        onHide={() => {
                                                                            this.setState({ editModalShow: false, selectedRowsIds: [] });
                                                                            this.crudTableRef.current.unselectAllRows();
                                                                            this.crudTableRef.current.fillTable();                                                            
                                                                        }}
                                                                        itemId={this.state.selectedRowsIds[0]}
                                                                        eventId={this.state.eventId}
                                                                        teamId={this.state.teamId}
                                                                        sayonaraMeeting={this.state.sayonaraMeeting}
                                                                        accommodation={this.state.accommodation}
                                /> 
                                <AddParticipantToTeamModal              show={this.state.addModalShow}
                                                                        onHide={() => {
                                                                            this.setState({ addModalShow: false, selectedRowsIds: [] });
                                                                            this.crudTableRef.current.unselectAllRows();
                                                                            this.crudTableRef.current.fillTable();                                                    
                                                                        }}                                                                
                                                                        eventId={this.state.eventId}
                                                                        teamId={this.state.teamId}
                                                                        sayonaraMeeting={this.state.sayonaraMeeting}
                                                                        accommodation={this.state.accommodation}
                                                                        signUpMe={this.state.signUpMe}
                                />   
                            </div>                                    
                        ) : (<div></div>)}                    
                        <Card>
                            <Card.Body>
                                <Card.Text>
                                    <CrudTableComponent itemsUrl={TOURNAMENT_REGISTRATIONS_FOR_TEAM} 
                                                        tableColumns={columns} 
                                                        selectedItemId={this.handleRowClick}
                                                        selectedIds={this.handleRowSelection}
                                                        emptyTableMessage={emptyTableMessage}
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
            )
        );
    }
}

export default withTranslation('translation', { withRef: true })(Team);