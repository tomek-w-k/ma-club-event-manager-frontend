import React, {Component} from "react";
import {
    Card,    
    Button,    
} from "react-bootstrap";
import { withTranslation } from "react-i18next";
import AuthService from "../service/auth-service";
import * as Urls from "../servers-urls";


const currentUser = AuthService.getCurrentUser();
const EXAM_REGISTRATION_API_URL = Urls.WEBSERVICE_URL + "/exam_registrations";


class ExamEventTile extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            eventContainsCurrentUser: false,
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
    }

    handleSignUp(e)
    {
        e.preventDefault();
        fetch(EXAM_REGISTRATION_API_URL,{
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
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
        // .then(response => response.json())
        .then(response => {                        
            if (response.ok)
            {
                console.log("rejestracja zakończona pomyślnie");                
                this.setState({ 
                    eventContainsCurrentUser: true                    
                })
                window.location.reload();
                return response
            }
            console.log("Będzie wyrzucony: ", response.message);
            throw new Error(response.message);            
        })
        .catch(error => {
            console.log("Przechwycony: ", error);
        })
    }

    handleSignOut(e)
    {
        e.preventDefault();
        fetch(EXAM_REGISTRATION_API_URL + "/" + this.state.examRegistrationId, {
            method: "DELETE"
        })
        .then(response => {
            if ( response.ok )
            {
                console.log("wypisano z egzaminu pomyślnie");
                this.setState({
                    eventContainsCurrentUser: false,
                    examRegistrationId: undefined
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
        const t = this.props.t;

        return(
            currentUser != null ? 
            (
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
                            Registrations:
                            { event.examRegistrations.map(reg => <li>{reg.user.email}</li>) }
                        </Card.Text>                        
                        <div className="d-flex flex-row-reverse">                                                        
                            {!eventContainsCurrentUser && (
                                <Button variant="info" onClick={this.handleSignUp} >{t("sign_up_event")}</Button>
                            )}
                            {eventContainsCurrentUser && (
                                <div className="d-flex flex-row">
                                    <div style={{display: "flex", alignItems: "center", marginRight: "10px"}}>{t("signed_up_event")}</div>    
                                    <Button variant="danger" onClick={this.handleSignOut}>{t("sign_out_event")}</Button> 
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