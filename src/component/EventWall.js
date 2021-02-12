import React, {Component} from "react";
import ExamEventTile from "./ExamEventTile";
import CampEventTile from "./CampEventTile";
import TournamentEventTile from "./TournamentEventTile";
import AuthService from "../service/auth-service";
import * as Urls from "../servers-urls";


const currentUser = AuthService.getCurrentUser();
const EVENTS_API_URL = Urls.WEBSERVICE_URL + "/events";


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
        fetch(EVENTS_API_URL, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        })
        .then(response => response.json())
        .then(data => {
            this.setState({
                events: data,
            });
        });
    }

    render()
    {
        this.props.navbarControlsHandler();

        return(
            currentUser != null ? 
            (
                <div > 
                    {this.state.events.map(event => {                        
                        if ( event.hasOwnProperty("examRegistrations") ) return <ExamEventTile event={event} />;
                        if ( event.hasOwnProperty("campRegistrations") ) return <CampEventTile event={event} />;
                        if ( event.hasOwnProperty("teams") ) return <TournamentEventTile event={event} />;
                    })}
                </div>
            ) : ( <h2>You have no priviledges granted to view Profile component.</h2> )
            
        )
    }
}

export default EventWall;