import React, {Component} from "react";
import TournamentDetails from "./TournamentDetails";
import TournamentRegistrations from "./TournamentRegistrations";
import TournamentTeams from "./TournamentTeams";
import AddTeamModal from "./AddTeamModal";
import {
    Tabs,
    Tab
} from "react-bootstrap";
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();


class Tournament extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            addTeamModalShow: false,
            selectedRowsIds: [],
            crudTableRef: null
        }

        this.goToEventWall = this.goToEventWall.bind(this);
        this.handleUpdateRegistration = this.handleUpdateRegistration.bind(this);        
        this.handleAddTeam = this.handleAddTeam.bind(this);
        this.handleDeleteRegistration = this.handleDeleteRegistration.bind(this);
        this.handleDeleteTeam = this.handleDeleteTeam.bind(this);        

        this.tournamentDetailsRef = React.createRef();
        this.tournamentRegistrationsRef = React.createRef();        
    }

    goToEventWall()
    {
        this.props.history.push("/event_wall_component");
        window.location.reload();
    }

    handleUpdateRegistration()
    {
        this.tournamentDetailsRef.current.refreshTournamentDetails();
    }

    handleAddTeam()
    {  
        this.setState({ addTeamModalShow: true });       
    }

    handleDeleteRegistration()
    {
        this.tournamentRegistrationsRef.current.handleDeleteItem();
    }

    handleDeleteTeam()
    {
        const t = this.props.t;
        
        if ( this.state.selectedRowsIds != null && this.state.selectedRowsIds.length == 1 )
        {
            if ( !window.confirm("Are you sure?") )
                return;

            fetch(Urls.WEBSERVICE_URL + "/user/" + currentUser.id + "/teams/" + this.state.selectedRowsIds[0], {
                method: "DELETE",
                headers : {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + currentUser.accessToken
                }
            })
            .then(result => {
                this.setState({ selectedRowsIds: [] });
                this.state.crudTableRef.current.unselectAllRows();
                this.state.crudTableRef.current.fillTable();
                this.tournamentRegistrationsRef.current.fillTable();
            },
                error => alert("Item not deleted.")
            );
        }            
        else alert(t("select_one_team_to_remove"));
    }

    handleSelectRow = (rows, crudTableRef) => {
        this.setState({
            selectedRowsIds: rows,
            crudTableRef: crudTableRef
        });        
    }

    render()
    {        
        this.props.navbarControlsHandler();
        const t = this.props.t;
       
        return(
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <div>
                    <AddTeamModal   show={this.state.addTeamModalShow}
                                    onHide={() => {
                                        this.setState({ addTeamModalShow: false });                                                                                            
                                    }}                                    
                                    eventId={this.props.match.params.id}                                    
                    />                     
                    <Tabs defaultActiveKey="tournament_details" className="tabsHeader">
                        <Tab eventKey="tournament_details" title={t("details")} >
                            <TournamentDetails id={this.props.match.params.id} onTournamentUpdate={this.goToEventWall} ref={this.tournamentDetailsRef} />
                        </Tab>
                        <Tab eventKey="registrations_by_participants" title={t("participants")}>
                            <TournamentRegistrations id={this.props.match.params.id} onRegistrationUpdate={this.handleUpdateRegistration} ref={this.tournamentRegistrationsRef} />
                        </Tab>
                        <Tab eventKey="registrations_by_teams" title={t("teams_capital")} >
                            <TournamentTeams    id={this.props.match.params.id} 
                                                onRegistrationUpdate={this.handleUpdateRegistration} 
                                                onSelectRow={this.handleSelectRow}                                                
                            />
                        </Tab>
                    </Tabs>

                </div>
            ): (<h2>You do not have priviledges  granted to view this section.</h2 > )
        )
    }
}

export default withTranslation('translation', { withRef: true })(Tournament)
