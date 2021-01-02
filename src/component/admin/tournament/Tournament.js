import React, {Component} from "react";
import TournamentDetails from "./TournamentDetails";
import TournamentRegistrations from "./TournamentRegistrations";

import AuthService from "../../../service/auth-service";


class Tournament extends Component
{
    constructor(props)
    {
        super(props);
        this.goToEventWall = this.goToEventWall.bind(this);
        this.handleUpdateRegistration = this.handleUpdateRegistration.bind(this);
        this.handleAddRegistration = this.handleAddRegistration.bind(this);
        this.handleDeleteRegistration = this.handleDeleteRegistration.bind(this);

        this.tournamentRegistrationsRef = React.createRef();
        this.tournamentDetailsRef = React.createRef();
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

    handleAddRegistration()
    {
        this.tournamentRegistrationsRef.current.handleShowAddParticipantModal();
    }

    handleDeleteRegistration()
    {
        this.tournamentRegistrationsRef.current.handleDeleteItem();
    }

    render()
    {
        const currentUser = AuthService.getCurrentUser();
        this.props.navbarControlsHandler();

        return(
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <div>
                    <TournamentDetails id={this.props.match.params.id} onTournamentUpdate={this.goToEventWall} ref={this.tournamentDetailsRef} />
                    <br />
                    <TournamentRegistrations id={this.props.match.params.id} onRegistrationUpdate={this.handleUpdateRegistration} ref={this.tournamentRegistrationsRef} />
                </div>
            ): (<h2>You do not have priviledges  granted to view this section.</h2 > )
        )
    }
}

export default Tournament;