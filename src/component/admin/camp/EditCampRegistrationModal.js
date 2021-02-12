import React, {Component} from "react";
import {
    Modal, 
    Form,
    Button,
    Row,
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
                feeReceived: false,
                sayonaraMeetingParticipation: false,
                clothingSize: null,
                accommodation: false
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
            let cs;
            if ( data.clothingSize == null )
                cs = {
                    value: null,
                    label: "-"
                }
            else 
                cs = {
                    value: data.clothingSize.id,
                    label: data.clothingSize.clothingSizeName
                }
            this.setState({ itemToUpdate: {...data, clothingSize: cs} })
        })
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
        .then(result => {            
            this.props.onHide();
        },
        error => {
            console.log("not updated");
        });
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
                        {this.state.itemToUpdate.user.fullName}
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Form.Group as={Row}>
                                <Form.Label column sm="4">{t("fee_received")}</Form.Label>
                                <Form.Check column sm="4"
                                    type="checkbox"
                                    name="feeReceived" 
                                    style={{display: "flex", alignItems: "center"}}
                                    checked={this.state.itemToUpdate.feeReceived}
                                    onChange={e => { this.setState({ itemToUpdate: {...this.state.itemToUpdate, feeReceived: e.target.checked} }) }}
                                />                            
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm="4">{t("sayonara")}</Form.Label>
                                <Form.Check column sm="4"
                                    type="checkbox"
                                    name="sayonaraMeetingParticipation" 
                                    style={{display: "flex", alignItems: "center"}}
                                    checked={this.state.itemToUpdate.sayonaraMeetingParticipation}
                                    onChange={e => { this.setState({ itemToUpdate: {...this.state.itemToUpdate, sayonaraMeetingParticipation: e.target.checked} }) }}
                                />
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm="4">{t("clothing_size")}</Form.Label>
                                <Select
                                    styles={clothingSizesSelectStyles}
                                    options={this.state.clothingSizes}                                    
                                    value={this.state.itemToUpdate.clothingSize}
                                    onChange={clothingSize => {                                        
                                        this.setState({ itemToUpdate: {...this.state.itemToUpdate, clothingSize: clothingSize} })                                        
                                    }}
                                />
                            </Form.Group>                        
                            <Form.Group as={Row}>
                                <Form.Label column sm="4">{t("accommodation")}</Form.Label>
                                <Form.Check column sm="4"
                                    type="checkbox"
                                    name="accommodation" 
                                    style={{display: "flex", alignItems: "center"}}
                                    checked={this.state.itemToUpdate.accommodation}
                                    onChange={e => { this.setState({ itemToUpdate: {...this.state.itemToUpdate, accommodation: e.target.checked} }) }}
                                />
                            </Form.Group>
                        </Container>                        
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