import React, {Component} from "react";
import {
    Card,    
    Button,
    Image    
} from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { Check } from "react-bootstrap-icons";
import AuthService from "../service/auth-service";
import * as Urls from "../servers-urls";
import moment from "moment";


const currentUser = AuthService.getCurrentUser();
const EXAM_REGISTRATION_API_URL = Urls.WEBSERVICE_URL + "/exam_registrations";
const EVENT_DATE_FORMAT = 'DD-MM-YYYY hh:mm:ss';



class ExamEventTile extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            eventContainsCurrentUser: false,
            isUpcoming: false,
            examRegistrationId: undefined
        }

        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);
    }

    componentDidMount()
    {
        this.props.event.examRegistrations.some(examRegistration => {            
            if ( examRegistration.user.id == currentUser.id ) 
            {                                    
                this.setState({ 
                    eventContainsCurrentUser: true,
                    examRegistrationId: examRegistration.id
                });
                return true;
            } 
            else this.setState({ 
                eventContainsCurrentUser: false,
                examRegistrationId: undefined
            });
        });

        // - - - Check if the event is not expired - - -                
        let eventStartDate = moment(this.props.event.startDate, EVENT_DATE_FORMAT).toDate();
        this.setState({ isUpcoming: eventStartDate > Date.now() });
    }

    handleSignUp(e)
    {
        e.preventDefault();
        fetch(EXAM_REGISTRATION_API_URL,{
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentUser.accessToken
            },
            body: JSON.stringify({
                id: null,
                user: {
                    id: currentUser.id                    
                },
                feeReceived: false,
                participationAccepted: false,
                examEvent: {
                    id: this.props.event.id                    
                }
            })
        })
        .then(response => {                        
            if (response.ok)
            {                
                this.setState({ eventContainsCurrentUser: true })
                window.location.reload();
                return response
            }
            throw new Error(response.message);            
        })
        .catch(error => console.log(error))
    }

    handleSignOut(e)
    {
        e.preventDefault();
        fetch(EXAM_REGISTRATION_API_URL + "/" + this.state.examRegistrationId, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        })
        .then(response => {
            if ( response.ok )
            {                
                this.setState({
                    eventContainsCurrentUser: false,
                    examRegistrationId: undefined
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
        const { eventContainsCurrentUser } = this.state;
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
            currentUser != null ? 
            (
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
                            {!eventContainsCurrentUser && this.state.isUpcoming && (
                                <Button variant="info" onClick={this.handleSignUp} >{t("sign_up_event")}</Button>
                            )}
                            {eventContainsCurrentUser && (
                                <div className="d-flex flex-row-reverse">
                                    <div>
                                        <Button variant="outline-success" disabled><Check color="#13A84D" size={22}/>{t("signed_up_event")}</Button>{' '}                                        
                                        {this.state.isUpcoming && (
                                            <Button variant="danger" onClick={this.handleSignOut}>{t("sign_out_event")}</Button> 
                                        )}
                                    </div>
                                </div>                                        
                            )}
                        </div>
                    </Card.Body>
                <Card.Footer>
                    {t("added")} {event.dateCreated}
                    <div style={{float: "right"}}>
                        {event.examRegistrations.length} persons registered
                    </div>                    
                </Card.Footer>
                </Card>
            ) : ( <h2>You have no priviledges granted to view this section.</h2> )
        );
    }
}

export default withTranslation()(ExamEventTile);