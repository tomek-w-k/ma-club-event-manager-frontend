import React, {Component} from "react";
import {
    Card,    
    Button,
    Image    
} from "react-bootstrap";
import TournamentRegistrationOptionChooserModal from "./TournamentRegistrationOptionChooserModal";
import AuthService from "../service/auth-service";
import * as Urls from "../servers-urls";


const currentUser = AuthService.getCurrentUser();
const TOURNAMENT_REGISTRATION_API_URL = Urls.WEBSERVICE_URL + "/tournament_registrations";


class TournamentEventTile extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {            
            eventContainsCurrentUser: false,
            tournamentRegistrationId: undefined,
            showChooserModal: false,
            eventPicture: ""
        }

        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);
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
        
        this.props.event.tournamentRegistrations.some(tournamentRegistration => {            
            if ( tournamentRegistration.user.id == currentUser.id ) 
            {                                    
                this.setState({ 
                    eventContainsCurrentUser: true,
                    tournamentRegistrationId: tournamentRegistration.id
                });
                return true;
            } 
            else this.setState({ 
                eventContainsCurrentUser: false,
                tournamentRegistrationId: undefined
            });
        });
    }

    handleSignUp(e)
    {
        e.preventDefault();
        this.setState({
            showChooserModal: true
        });
    }

    handleSignOut(e)
    {
        e.preventDefault();
        fetch(TOURNAMENT_REGISTRATION_API_URL + "/" + this.state.tournamentRegistrationId, {
            method: "DELETE"
        })
        .then(response => {
            if ( response.ok )
            {
                console.log("wypisano z obozu pomyślnie");
                this.setState({
                    eventContainsCurrentUser: false,
                    tournamentRegistrationId: undefined
                });
                window.location.reload();
                return response;
            }
            throw new Error(response.message);
        })
        .catch(error => {
            console.log(error);
        })
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
                    <TournamentRegistrationOptionChooserModal   show={this.state.showChooserModal}
                                                                onHide={() => {
                                                                    this.setState({ showChooserModal: false });
                                                                    window.location.reload();                                                                 
                                                                }}                                                            
                                                                eventId={event.id}
                                                                sayonaraMeeting={event.sayonaraMeeting}
                                                                accommodation={event.accommodation}
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
                                Registrations:
                                { event.tournamentRegistrations.map(reg => <li>{reg.user.email}</li>) }
                            </Card.Text>                        
                            <div className="d-flex flex-row-reverse">                                                        
                                {!eventContainsCurrentUser && (
                                    <Button variant="info" onClick={this.handleSignUp} >Sign Up</Button>
                                )}
                                {eventContainsCurrentUser && (
                                    <div className="d-flex flex-row">
                                        <div style={{display: "flex", alignItems: "center", marginRight: "10px"}}>Signed up</div>    
                                        <Button variant="danger" onClick={this.handleSignOut}>Sign Out</Button> 
                                    </div>                                        
                                )}
                            </div>
                        </Card.Body>
                    <Card.Footer>
                        Added: {event.dateCreated}
                        <div style={{float: "right"}}>
                            {event.tournamentRegistrations.length} persons registered
                        </div>                    
                    </Card.Footer>
                    </Card>
                </div>
            ) : ( <h2>You have no priviledges granted to view this section.</h2> )
        );
    }
}

export default TournamentEventTile;