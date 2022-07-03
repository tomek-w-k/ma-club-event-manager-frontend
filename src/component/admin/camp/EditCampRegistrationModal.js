import React, {Component} from "react";
import {
    Modal, 
    Form,
    Button,
    Row,
    Card,
    Col,
    Container,
    Alert
    } from "react-bootstrap";
import Select from "react-select";
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();
const CAMP_REGISTRATIONS = Urls.WEBSERVICE_URL + "/camp_registrations"; 
const CAMP_EVENTS = Urls.WEBSERVICE_URL + "/camp_events"; 


class EditCampRegistrationModal extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            itemToUpdate: {
                id: null,
                user: {
                    id: null,
                    fullName: "",
                    email: "",
                    password: "",
                    country: "",
                    roles: [],
                    rank: null,
                    club: null,
                    branchChief: null
                },
                advancePayment: null,
                feeReceived: false,
                sayonaraMeetingParticipation: false,                
                accommodation: false,
                clothingSize: null
            },
            clothingSizes: []
        }
        this.loadItemToUpdate = this.loadItemToUpdate.bind(this);
        this.handleUpdateRegistration = this.handleUpdateRegistration.bind(this);
    }

    componentDidMount()
    {        
        fetch(CAMP_EVENTS + "/" + this.props.eventId + "/clothing_sizes", {
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

    loadItemToUpdate()
    {        
        fetch(CAMP_REGISTRATIONS + "/" + this.props.itemId, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        })
        .then(response => response.json())
        .then(data => {
            let advancePayment;

            if ( data.advancePayment == null )
                advancePayment = null;
            else advancePayment = data.advancePayment;
            
            let clothingSize;

            if ( data.clothingSize == null )
                clothingSize = {
                    value: null,
                    label: "-"
                }
            else 
                clothingSize = {
                    value: data.clothingSize.id,
                    label: data.clothingSize.clothingSizeName
                }       

            this.setState({ 
                itemToUpdate: {
                    ...data,
                    advancePayment: advancePayment,
                    feeReceived: data.feeReceived ? true : false,
                    sayonaraMeetingParticipation: data.sayonaraMeetingParticipation ? true : false,
                    accommodation: data.accommodation ? true : false,
                    clothingSize: clothingSize
                } 
            });
        });
    }

    handleUpdateRegistration(e)
    {
        e.preventDefault();

        let cs;
        if ( this.state.itemToUpdate.clothingSize.value == null && this.state.itemToUpdate.clothingSize.label == "-" )
            cs = null;
        else
            cs = {
                id: this.state.itemToUpdate.clothingSize.value,
                clothingSizeName: this.state.itemToUpdate.clothingSize.label
            };
        let itemToUpdate = {...this.state.itemToUpdate, clothingSize: cs};
        
        fetch(CAMP_REGISTRATIONS, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentUser.accessToken
            },
            body: JSON.stringify(itemToUpdate)           
        })
        .then(response => response.json())
        .then(
            result => this.props.onHide(),
            error => console.log("not updated")
        );
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
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
            <Modal 
                show={this.props.show}                
                onHide={this.props.onHide}
                onEnter={this.loadItemToUpdate}
                animation="true"
                size="lg"
                centered="true"                
            >
                <Form onSubmit={this.handleUpdateRegistration}>
                    <Modal.Header>
                        {t("edit_registration")} - {this.state.itemToUpdate.user.fullName}
                    </Modal.Header>
                    <Modal.Body>
                        <Card>
                            <Card.Header>{t("personal_details")}</Card.Header>
                            <Card.Body>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="4">{t("full_name")}</Form.Label>
                                    <Form.Label column sm="8">{this.state.itemToUpdate.user.fullName}</Form.Label>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="4">{t("club")}</Form.Label>
                                    <Form.Label column sm="8">{this.state.itemToUpdate.user.club?.clubName}</Form.Label>                                    
                                </Form.Group>
                            </Card.Body>
                        </Card>
                        <div style={{height: "16px"}}></div>
                        <Card>
                            <Card.Header>{t("administrative_tools")}</Card.Header>
                            <Card.Body>
                                <Form.Group as={Row} style={{alignItems: "center"}}>
                                    <Form.Label column sm="4">{t("advance_payment")}</Form.Label>
                                    <Col sm="8">
                                        <Row style={{alignItems: "center"}}>
                                            <Col sm="10">
                                                <Form.Control
                                                    type="text"
                                                    name="advancePayment"                                              
                                                    maxLength="255"                                   
                                                    value={this.state.itemToUpdate.advancePayment ? this.state.itemToUpdate.advancePayment : ""}
                                                    onChange={e => { this.setState({ itemToUpdate: {...this.state.itemToUpdate, advancePayment: e.target.value} }) }}                           
                                                />
                                            </Col>
                                            <Col sm="2">[PLN]</Col>
                                        </Row>                                                                    
                                    </Col>                                    
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="4">{t("fee_received")}</Form.Label>
                                    <Col sm="8">
                                        <Form.Check
                                            type="checkbox"
                                            name="feeReceived" 
                                            style={{display: "flex", alignItems: "center"}}
                                            checked={this.state.itemToUpdate.feeReceived}
                                            onChange={e => { this.setState({ itemToUpdate: {...this.state.itemToUpdate, feeReceived: e.target.checked} }) }}
                                        />
                                    </Col>                  
                                </Form.Group>                                
                            </Card.Body>
                        </Card>
                        <div style={{height: "16px"}}></div>
                        <Card>
                            <Card.Header>{t("registration_options")}</Card.Header>
                            <Card.Body>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="4">{t("sayonara")}</Form.Label>
                                    <Col sm="8">
                                        <Form.Check
                                            type="checkbox"
                                            name="sayonaraMeetingParticipation" 
                                            style={{display: "flex", alignItems: "center"}}
                                            checked={this.state.itemToUpdate.sayonaraMeetingParticipation}
                                            onChange={e => { this.setState({ itemToUpdate: {...this.state.itemToUpdate, sayonaraMeetingParticipation: e.target.checked} }) }}
                                        />
                                    </Col>
                                </Form.Group>                            
                                <Form.Group as={Row}>
                                    <Form.Label column sm="4">{t("accommodation")}</Form.Label>
                                    <Col sm="8">
                                        <Form.Check
                                            type="checkbox"
                                            name="accommodation" 
                                            style={{display: "flex", alignItems: "center"}}
                                            checked={this.state.itemToUpdate.accommodation}
                                            onChange={e => { this.setState({ itemToUpdate: {...this.state.itemToUpdate, accommodation: e.target.checked} }) }}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} style={{alignItems: "center"}}>
                                    <Form.Label column sm="4">{t("clothing_size")}</Form.Label>
                                    <Col sm="8">
                                        <Select
                                            styles={clothingSizesSelectStyles}
                                            options={this.state.clothingSizes}                                    
                                            value={this.state.itemToUpdate.clothingSize}
                                            onChange={clothingSize => {                                        
                                                this.setState({ itemToUpdate: {...this.state.itemToUpdate, clothingSize: clothingSize} })                                        
                                            }}
                                        />
                                    </Col>
                                </Form.Group>
                            </Card.Body>
                        </Card>                       
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <Button variant="info" onClick={this.props.onHide} type="submit">{t("save")}</Button>{' '}                            
                            <Button variant="secondary" onClick={this.props.onHide}>{t("cancel")}</Button>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
            ): (
                <Alert variant="danger">
                    <Alert.Heading>Access denided</Alert.Heading>
                    <p>You have no priviledges granted to view this section.</p>
                </Alert> 
            )
        );
    }
}

export default withTranslation()(EditCampRegistrationModal);