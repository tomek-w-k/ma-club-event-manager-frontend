import React, {Component} from "react";
import CampDetails from "./CampDetails";
import CampRegistrations from "./CampRegistrations";

import AuthService from "../../../service/auth-service";


class Camp extends Component
{
    constructor(props)
    {
        super(props);
        this.goToEventWall = this.goToEventWall.bind(this);
        this.handleUpdateRegistration = this.handleUpdateRegistration.bind(this);
        this.handleAddRegistration = this.handleAddRegistration.bind(this);
        this.handleDeleteRegistration = this.handleDeleteRegistration.bind(this);

        this.campRegistrationsRef = React.createRef();
        this.campDetailsRef = React.createRef();
    }

    goToEventWall()
    {
        this.props.history.push("/event_wall_component");
        window.location.reload();
    }

    handleUpdateRegistration()
    {
        this.campDetailsRef.current.refreshCampDetails();
    }

    handleAddRegistration()
    {
        this.campRegistrationsRef.current.handleShowAddParticipantModal();
    }

    handleDeleteRegistration()
    {
        this.campRegistrationsRef.current.handleDeleteItem();
    }

    render()
    {
        const currentUser = AuthService.getCurrentUser();
        this.props.navbarControlsHandler();

        return(
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <div>
                    <CampDetails id={this.props.match.params.id} onCampUpdate={this.goToEventWall} ref={this.campDetailsRef} />
                    <br />
                    <CampRegistrations id={this.props.match.params.id} onRegistrationUpdate={this.handleUpdateRegistration} ref={this.campRegistrationsRef} />
                </div>
            ): (<h2>You do not have priviledges  granted to view this section.</h2 > )
        )
    }
}

export default Camp;