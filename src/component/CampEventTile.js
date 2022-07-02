import React, {Component} from "react";
import {
    Card,    
    Button,
    Image  
} from "react-bootstrap";
import CampRegistrationOptionChooserModal from "./CampRegistrationOptionChooserModal";
import { withTranslation } from "react-i18next";
import { Check, Triangle } from "react-bootstrap-icons";
import { ExclamationTriangle } from "react-bootstrap-icons";
import AuthService from "../service/auth-service";
import * as Urls from "../servers-urls";
import moment from "moment";
import { fetchMetadataForDelete } from "../utils/fetchMetadata";


const currentUser = AuthService.getCurrentUser();
const CAMP_REGISTRATION_API_URL = Urls.WEBSERVICE_URL + "/camp_registrations";
const EVENT_DATE_FORMAT = 'DD-MM-YYYY hh:mm:ss';



class CampEventTile extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {            
            containsCurrentUser: false,
            isUpcoming: false,
            isSuspended: false,
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
                    containsCurrentUser: true,
                    campRegistrationId: campRegistration.id
                });
                return true;
            } 
            else this.setState({ 
                containsCurrentUser: false,
                campRegistrationId: undefined
            });
        });

        // - - - Check if the event is not expired - - -                
        let eventStartDate = moment(this.props.event.startDate, EVENT_DATE_FORMAT).toDate();
        
        this.setState({ 
            isUpcoming: eventStartDate > Date.now(),
            isSuspended: this.props.event.suspendRegistration
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
        fetch(CAMP_REGISTRATION_API_URL + "/" + this.state.campRegistrationId, fetchMetadataForDelete(currentUser))
        .then(response => {
            if ( response.ok )
            {                
                this.setState({
                    containsCurrentUser: false,
                    campRegistrationId: undefined
                });
                this.forceUpdate();
                window.location.reload();                    
                return response;
            }
            throw new Error(response.message);
        })
        .catch(error => console.log(error))        
    }

    render()
    {   
        const event = this.props.event;
        const { containsCurrentUser } = this.state;
        const { isUpcoming } = this.state;
        const { isSuspended } = this.state;
        const t = this.props.t;

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
                    <CampRegistrationOptionChooserModal     show={this.state.showChooserModal}
                                                            onHide={() => {
                                                                this.setState({ showChooserModal: false });                                                                
                                                                window.location.reload();                                                                 
                                                            }}                                                            
                                                            eventId={event.id}
                                                            sayonaraMeeting={this.props.event.sayonaraMeeting}
                                                            accommodation={this.props.event.accommodation}
                                                            showAccommodationOnRegistrationForm={this.props.event.showAccommodationOnRegistrationForm}
                    />
                    <Card style={{marginBottom: "20px"}}>
                        <Card.Body>
                            <Card.Title>{event.eventName}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{event.startDate} - {event.endDate}</Card.Subtitle>
                            <br />
                            {event.eventDescription && (
                                <Card.Text style={{whiteSpace: "pre-wrap"}}>                            
                                    { event.eventDescription }                                                        
                                </Card.Text>
                            )}                            
                            <div style={imageContainerStyle}>
                                <Image style={imageStyle} src={this.props.event.eventPicturePath ? this.props.event.eventPicturePath : ""} />
                            </div>
                            <br />                                              
                            <div className="d-flex flex-row-reverse">                                                        
                                {!containsCurrentUser && !isSuspended && isUpcoming && (event.campRegistrations.length < event.numberOfPlaces) && (
                                    <Button variant="info" onClick={this.handleSignUp} >{t("sign_up_event")}</Button>
                                )}                                
                                {containsCurrentUser && (                                    
                                    <div>
                                        <Button variant="outline-success" disabled><Check color="#13A84D" size={22}/>{t("signed_up_event")}</Button>{' '}                                        
                                        {this.state.isUpcoming && (
                                            <Button variant="danger" onClick={this.handleSignOut}>{t("sign_out_event")}</Button> 
                                        )}
                                    </div>                                    
                                )}
                                {isSuspended && isUpcoming && (
                                    <div style={{paddingRight: "5px"}}>
                                        <Button variant="warning" disabled><ExclamationTriangle size={17}/>{' '}{t("registration_suspended")}</Button>
                                    </div> 
                                )}
                            </div>
                        </Card.Body>
                    <Card.Footer>
                        {t("added")} {event.dateCreated}
                        <div style={{float: "right"}}>
                           {t("persons_registered")}: {event.campRegistrations.length} / {event.numberOfPlaces}
                        </div>                    
                    </Card.Footer>
                    </Card>
                </div>
            ) : ( <h2>You have no priviledges granted to view this section.</h2> )
        );
    }
}

export default withTranslation()(CampEventTile);