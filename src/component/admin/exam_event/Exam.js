import React, {Component} from "react";
import ExamDetails from "./ExamDetails";
import ExamRegistrations from "./ExamRegistrations";
import ExamHelp from "./ExamHelp";

import AuthService from "../../../service/auth-service";


class Exam extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            showHelp: false,
        }

        this.toggleHelpSection = this.toggleHelpSection.bind(this);
        this.goToEventWall = this.goToEventWall.bind(this);
        this.handleAddRegistration = this.handleAddRegistration.bind(this);
        this.handleDeleteRegistration = this.handleDeleteRegistration.bind(this);

        this.examRegistrationsRef = React.createRef();
    }

    toggleHelpSection()
    {
        if ( this.state.showHelp ) 
            this.setState({ showHelp: false });
        else this.setState({ showHelp: true});        
    }

    goToEventWall()
    {
        this.props.history.push("/event_wall_component");
        window.location.reload();
    }

    handleAddRegistration()
    {
        this.examRegistrationsRef.current.handleShowAddParticipantModal();
    }

    handleDeleteRegistration()
    {
        this.examRegistrationsRef.current.handleDeleteItem();
    }

    render()
    {
        const currentUser = AuthService.getCurrentUser();
        this.props.navbarControlsHandler();
        
        return(
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (   
                <div>
                    {this.state.showHelp && (<div><ExamHelp toggleHelpSectionHandler={this.toggleHelpSection} /><br /></div>)}
                    <ExamDetails id={this.props.match.params.id} onExamUpdate={this.goToEventWall} />
                    <br />
                    <ExamRegistrations id={this.props.match.params.id} ref={this.examRegistrationsRef} />
                </div>
            ): ( <h2>You do not have priviledges  granted to view this section.</h2 > )
        )
    }
}

export default Exam;