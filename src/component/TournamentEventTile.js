import React, {Component} from "react";
import {
    Card,    
    Button,
    Image    
} from "react-bootstrap";
import AuthService from "../service/auth-service";
import * as Urls from "../servers-urls";
import {withRouter} from "react-router-dom";
import {Check, X} from "react-bootstrap-icons";
import ConfirmationDialogModal from "./ConfirmationDialogModal";


const currentUser = AuthService.getCurrentUser();


class TournamentEventTile extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {            
            eventContainsCurrentUser: false,
            teamId: undefined,            
            eventPicture: "",
            confirmSignOutTeamModalShow: false,            
        }

        this.handleSignUp = this.handleSignUp.bind(this);        
        this.personsRegistered = this.personsRegistered.bind(this);
    }   

    componentDidMount()
    {   
        // - - - Get event picture - - - 
        let eventPictureName = this.props.event.eventPicturePath ? this.props.event.eventPicturePath.split('\\').pop().split('/').pop() : "";
        let getTournamentPictureUrl = Urls.EXPRESS_JS_URL + "/get_tournament_picture/" + this.props.event.id + "/" + eventPictureName;

        fetch(getTournamentPictureUrl)
        .then(response => response.blob())
        .then(blob => {
            let fileName = this.props.event.eventPicturePath ? this.props.event.eventPicturePath.split('\\').pop().split('/').pop() : "";
            let file = new File([blob], fileName, {type:"image/jpeg", lastModified:new Date()});
            return {
                file: file,
                name: fileName
            };
        })
        .then(fileWithNameObject => {
            this.setState({ eventPicture: fileWithNameObject });
        });

        // - - - Disable Team registration if current user has already a team registered for this tournament - - - 
        this.props.event.teams.some(team => {            
            if ( team.trainer.id == currentUser.id ) 
            {                                    
                this.setState({ 
                    eventContainsCurrentUser: true,
                    teamId: team.id
                });
                return true;
            } 
            else this.setState({ 
                eventContainsCurrentUser: false,
                teamId: undefined
            });
        });
    }

    handleSignUp(e)
    {
        e.preventDefault();
        
        let team = {
            trainer: {
                id: currentUser.id
            },
            tournamentRegistrations: []
        };
        
        fetch(Urls.WEBSERVICE_URL + "/tournament_events/" + this.props.event.id + "/teams", {
            method: "POST",
            headers : {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(team)
        })
        .then(response => response.json())
        .then(savedTeam => {            
            this.props.history.push("/user/" + currentUser.id + "/team_component/" + savedTeam.id);
        });        
    }

    personsRegistered()
    {
        let personsRegistered = 0;
        this.props.event.teams.forEach(team => {
            personsRegistered = personsRegistered + team.tournamentRegistrations.length;
        });

        return personsRegistered;
    }

    handleSignOut = result => {
        if ( result )
            fetch(Urls.WEBSERVICE_URL + "/user/" + currentUser.id + "/teams/" + this.state.teamId, {
                method: "DELETE"
            })
            .then(response => {
                if ( response.ok )
                {                
                    this.setState({
                        eventContainsCurrentUser: false,
                        teamId: undefined
                    });
                    this.forceUpdate();                    
                    return response;
                }
                throw new Error(response.message);
            })
            .catch(error => console.log(error))
    }    

    render()
    {   
        const event = this.props.event;
        const {
            eventContainsCurrentUser
        } = this.state;
        
        const imageContainerStyle = {
            textAlign: "center", 
            backgroundColor: "gainsboro"		
        };
        
        const imageStyle = {
            color: "black",
            maxWidth: "640px",
            maxHeight: "480px"
        };

        return(
            currentUser != null && currentUser.roles.includes("ROLE_USER") ? 
            (
                <div>
                    <ConfirmationDialogModal    show={this.state.confirmSignOutTeamModalShow}
                                                onHide={() => this.setState({ confirmSignOutTeamModalShow: false }) }
                                                confirmationResult={this.handleSignOut}                                                
                    />                                  
                    <Card style={{marginBottom: "20px"}}>
                        <Card.Body>
                            <Card.Title>{event.eventName}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{event.startDate} - {event.endDate}</Card.Subtitle>
                            <br />
                            <Card.Text>                            
                                { event.eventDescription }                                                        
                            </Card.Text>
                            <div style={imageContainerStyle}>
                                <Image style={imageStyle} src={this.state.eventPicture ? URL.createObjectURL(this.state.eventPicture.file) : ""} />
                            </div>                            
                            <Card.Text>                                                                
                                Room types:
                                { event.roomTypes.map(rt => <li>{rt.roomTypeName}</li> ) }
                                Stay periods:
                                { event.stayPeriods.map(sp => <li>{sp.stayPeriodName}</li> ) }
                                Weight / age categories:
                                { event.weightAgeCategories.map(wac => <li>{wac.categoryName}</li> ) }
                                Teams registered (by trainer):
                                { event.teams.map(team => <li>{team.trainer.email}</li>) }
                            </Card.Text>                                           
                            {!eventContainsCurrentUser && currentUser.roles.includes("ROLE_TRAINER") && (
                                <div>
                                    <div className="d-flex flex-row-reverse">
                                        <Button variant="info" onClick={this.handleSignUp} >Sign up a team *</Button>
                                    </div> <br />
                                    <small><i>
                                        * If you want to participate in a tournament as a judge and register only yourself, click "Sign up a team" and then "Sign up me...".
                                        Choose your registration options in the window that appeared (don't forget to check "As a judge participation" option) and then click "Sign up"
                                    </i></small>
                                </div>
                            )}
                            {eventContainsCurrentUser  && currentUser.roles.includes("ROLE_TRAINER") && (
                                <div className="d-flex flex-row-reverse">
                                    <div>
                                        <Button variant="outline-success" disabled>
                                            <Check color="#13A84D" size={22}/>
                                        Signed up</Button>{' '}
                                        <Button variant="danger" onClick={() => this.setState({ confirmSignOutTeamModalShow: true })}>Sign out my team</Button> 
                                    </div>
                                </div>                                        
                            )}                                                     
                        </Card.Body>
                    <Card.Footer>
                        Added: {event.dateCreated}
                        <div style={{float: "right"}}>
                            {this.personsRegistered()} persons registered
                        </div>                    
                    </Card.Footer>
                    </Card>
                </div>
            ) : ( <h2>You have no priviledges granted to view this section.</h2> )
        );
    }
}

export default withRouter(TournamentEventTile);