import React, {Component} from "react";
import {
    Modal, 
    Form,
    Button,
    Row,
    Container
    } from "react-bootstrap";
import Select from "react-select";
import { withTranslation } from "react-i18next";
import AuthService from "../service/auth-service";
import * as Urls from "../servers-urls";


const currentUser = AuthService.getCurrentUser();
const CAMP_EVENTS = Urls.WEBSERVICE_URL + "/camp_events"; 
const CAMP_REGISTRATIONS = Urls.WEBSERVICE_URL + "/camp_registrations"; 


class CampRegistrationOptionChooserModal extends Component
{
    constructor(props)
    {        
        super(props);
        this.state = {
            campRegistration: {
                id: null,
                user: null,
                feeReceived: false,
                sayonaraMeetingParticipation: false,
                clothingSize: {
                    value: null,
                    label: ""
                },
                accommodation: false,
                campEvent: {
                    id: this.props.eventId                    
                }
            },
            clothingSizes: [],
            selectedRowsIds: []
        }        
        this.handleSignUp = this.handleSignUp.bind(this); 
        this.handleClearForm = this.handleClearForm.bind(this);
    }

    componentDidMount()
    {        
        fetch(CAMP_EVENTS + "/" + this.props.eventId + "/clothing_sizes",{
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        })
        .then(response => response.json())
        .then((data) => {                
            let cs = [];
            cs.push( { value: null, label: "-" } );
            data.map((clothingSize) => {
                cs.push( { value: clothingSize.id, label: clothingSize.clothingSizeName } )
            })                
            this.setState({ clothingSizes: cs });
        })        
    }

    handleClearForm()
    {
        this.setState({
            campRegistration: {
                id: null,
                user: null,
                feeReceived: false,
                sayonaraMeetingParticipation: false,
                clothingSize: {
                    value: null,
                    label: ""
                },
                accommodation: false,
                campEvent: {
                    id: this.props.eventId                    
                }
            },
            selectedRowsIds: []
        });
    }
    
    handleSignUp(e)
    {
        e.preventDefault();
                   
        let cs;
        if ( this.state.campRegistration.clothingSize.value == null && 
                (this.state.campRegistration.clothingSize.label == "-" || this.state.campRegistration.clothingSize.label == "") )
            cs = null;
        else
            cs = {
                id: this.state.campRegistration.clothingSize.value,
                clothingSizeName: this.state.campRegistration.clothingSize.label
            };
        let campRegistration = {...this.state.campRegistration, clothingSize: cs, user: {id: currentUser.id}};            
           console.log(campRegistration)         ;
        fetch(CAMP_REGISTRATIONS, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentUser.accessToken
            },
            body: JSON.stringify(campRegistration)           
        })            
        .then(result => {            
            return new Promise((resolve, reject) => {
                if(result.ok)
                    resolve("Participant added")
                else reject(result);                    
            })    
        },
        error => { console.log("not updated") })    
        .then( msg => {                
            this.props.onHide();
        },
        error => {
            error.json()
            .then((text) => {                    
                alert(text.message);
            })                
        })        
    }

    render()
    {
        const clothingSizesSelectStyles = {
            container: base => ({
                ...base,
                flex: 1,                
            })
        };
        const t = this.props.t;

        return (
            currentUser != null && currentUser.roles.includes("ROLE_USER") ?
            (
                <Modal 
                    show={this.props.show}                
                    onHide={this.props.onHide}
                    onEnter={() => this.handleClearForm()}                
                    animation="true"
                    size="lg"
                    centered="true"                
                >
                <Form onSubmit={this.handleSignUp}>
                    <Modal.Header>{t("add_participant_capital")}</Modal.Header>
                    <Modal.Body>
                        <Container>                            
                            <Form.Group>
                                {this.props.sayonaraMeeting && (
                                    <Row>
                                        <Form.Label column sm="4">{t("sayonara")}</Form.Label>
                                        <Form.Check column sm="4"
                                            type="checkbox"
                                            name="sayonaraMeetingParticipation" 
                                            style={{display: "flex", alignItems: "center"}}
                                            checked={this.state.campRegistration.sayonaraMeetingParticipation}
                                            onChange={e => { 
                                                this.setState({ 
                                                    campRegistration: {...this.state.campRegistration, sayonaraMeetingParticipation: e.target.checked} 
                                                }) 
                                            }}
                                        />
                                    </Row>
                                )}
                                {this.props.accommodation && this.props.showAccommodationOnRegistrationForm && (
                                    <Row>
                                        <Form.Label column sm="4">{t("accommodation")}</Form.Label>
                                        <Form.Check column sm="4"
                                            type="checkbox"
                                            name="accommodation" 
                                            style={{display: "flex", alignItems: "center"}}
                                            checked={this.state.campRegistration.accommodation}
                                            onChange={e => { this.setState({ campRegistration: {...this.state.campRegistration, accommodation: e.target.checked} }) }}
                                        />
                                    </Row>
                                )}
                                <br />
                                <Row>
                                    <Form.Label column sm="4">{t("clothing_size")}</Form.Label>
                                    <Select
                                        styles={clothingSizesSelectStyles}
                                        options={this.state.clothingSizes}                                    
                                        value={this.state.campRegistration.clothingSize}
                                        onChange={clothingSize => {                                        
                                            this.setState({ campRegistration: {...this.state.campRegistration, clothingSize: clothingSize} })                                        
                                        }}
                                    />
                                </Row>
                            </Form.Group>
                        </Container>                                               
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <Button variant="info" type="submit">{t("save")}</Button>{' '}                            
                            <Button variant="secondary" onClick={this.props.onHide}>{t("cancel")}</Button>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
            ): (<h2>You do not have priviledges  granted to view this section.</h2 >)
        );
    }
}

export default withTranslation()(CampRegistrationOptionChooserModal);