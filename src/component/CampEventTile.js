import React, {Component} from "react";
import {
    Card,    
    Button,    
} from "react-bootstrap";
import CampRegistrationOptionChooserModal from "./CampRegistrationOptionChooserModal";
import AuthService from "../service/auth-service";
import * as Urls from "../servers-urls";


const currentUser = AuthService.getCurrentUser();
const CAMP_REGISTRATION_API_URL = Urls.WEBSERVICE_URL + "/camp_registrations";


class CampEventTile extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {            
            eventContainsCurrentUser: false,
            campRegistrationId: undefined,
            showChooserModal: false,
        }

        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);
    }

    componentDidMount()
    {
        this.props.event.campRegistrations.some(campRegistration => {            
            if ( campRegistration.user.id == currentUser.id ) 
            {                                    
                this.setState({ 
                    eventContainsCurrentUser: true,
                    campRegistrationId: campRegistration.id
                });
                return true;
            } 
            else this.setState({ 
                eventContainsCurrentUser: false,
                campRegistrationId: undefined
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
        fetch(CAMP_REGISTRATION_API_URL + "/" + this.state.campRegistrationId, {
            method: "DELETE"
        })
        .then(response => {
            if ( response.ok )
            {
                console.log("wypisano z egzaminu pomyślnie");
                this.setState({
                    eventContainsCurrentUser: false,
                    campRegistrationId: undefined
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
        
        return(
            currentUser != null && currentUser.roles.includes("ROLE_USER") ? 
            (
                <div>
                    <CampRegistrationOptionChooserModal     show={this.state.showChooserModal}
                                                            onHide={() => {
                                                                this.setState({ showChooserModal: false });
                                                                window.location.reload();                                                                 
                                                            }}                                                            
                                                            eventId={event.id}
                                                            sayonaraMeeting={this.props.event.sayonaraMeeting}
                    />
                    <Card style={{marginBottom: "20px"}}>
                        <Card.Body>
                            <Card.Title>{event.eventName}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{event.startDate} - {event.endDate}</Card.Subtitle>
                            <br />
                            <Card.Text>                            
                                { event.eventDescription }                                                        
                            </Card.Text>
                            <Card.Text>
                                Fees:                            
                                { event.fees.map(fee => <li>{fee.title} : {fee.amount} PLN</li>) }
                                <div>Clothing type: {event.clothingType}</div>
                                Sizes:
                                { event.clothingSizes.map(clothingSize => <li>{clothingSize.clothingSizeName}</li>) }
                                Registrations:
                                { event.campRegistrations.map(reg => <li>{reg.user.email}</li>) }
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
                            {event.campRegistrations.length} persons registered
                        </div>                    
                    </Card.Footer>
                    </Card>
                </div>
            ) : ( <h2>You have no priviledges granted to view this section.</h2> )
        );
    }
}

export default CampEventTile;