import React, {Component} from "react";
import ExamEventTile from "./ExamEventTile";
import CampEventTile from "./CampEventTile";
import AuthService from "../service/auth-service";


const EVENTS_API_URL = "http://localhost:8081/events";


class EventWall extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            events: [],            
        }
    }

    componentDidMount()
    {
        fetch(EVENTS_API_URL)
        .then(response => response.json())
        .then(data => {
            this.setState({
                events: data,
            });
        });
    }

    render()
    {
        const currentUser = AuthService.getCurrentUser();
        this.props.navbarControlsHandler();

        return(
            currentUser != null ? 
            (
                <div > 
                    {this.state.events.map(event => {                        
                        if ( event.hasOwnProperty("examRegistrations") ) return <ExamEventTile event={event} />;
                        if ( event.hasOwnProperty("campRegistrations") ) return <CampEventTile event={event} />;
                        if ( event.hasOwnProperty("tournamentRegistrations") ) console.log("torunam");
                    })}
                </div>
            ) : ( <h2>You have no priviledges granted to view Profile component.</h2> )
            
        )
    }
}

export default EventWall;