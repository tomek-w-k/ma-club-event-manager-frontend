import React, {Component} from "react";
import {
    Modal, 
    Form,
    Button,
    Row,
    Col,    
    Card,
    Alert
    } from "react-bootstrap";
import Select from "react-select";
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();
const TOURNAMENT_REGISTRATIONS = Urls.WEBSERVICE_URL + "/tournament_registrations"; 
const TOURNAMENT_EVENTS = Urls.WEBSERVICE_URL + "/tournament_events"; 


class EditTournamentRegistrationModal extends Component
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
                accommodation: false,
                roomType: null,
                stayPeriod: null,
                asJudgeParticipation: false,
                weightAgeCategory: null,
                team: {
                    id: null
                }
            },
            roomTypes: [],
            stayPeriods: [],
            weightAgeCategories: [],
        }
        this.loadItemToUpdate = this.loadItemToUpdate.bind(this);
        this.handleUpdateRegistration = this.handleUpdateRegistration.bind(this);
    }

    componentDidMount()
    {        
        let requests = [];  
        
        const OptionsNames = Object.freeze ({
            ROOM_TYPES: 0,
            STAY_PERIODS: 1,
            WEIGHT_AGE_CATEGORIES: 2
        });

        requests.push(fetch(TOURNAMENT_EVENTS + "/" + this.props.eventId + "/room_types", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        }));
        requests.push(fetch(TOURNAMENT_EVENTS + "/" + this.props.eventId + "/stay_periods", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        }));
        requests.push(fetch(TOURNAMENT_EVENTS + "/" + this.props.eventId + "/weight_age_categories", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        }));
        
        Promise.all(requests)
        .then(responses =>  responses.map(response => response.json()) )
        .then(jsonResponses => {            
            Promise.all(jsonResponses)
            .then(data => {
                let roomTypes = data[OptionsNames.ROOM_TYPES];
                let rt = [];
                rt.push( { value: null, label: "-" } );
                roomTypes.forEach(roomType => {
                    rt.push( { value: roomType.id, label: roomType.roomTypeName } )
                });

                let stayPeriods = data[OptionsNames.STAY_PERIODS];
                let sp = [];
                sp.push( { value: null, label: "-" } );
                stayPeriods.forEach(stayPeriod => {
                    sp.push( { value: stayPeriod.id, label: stayPeriod.stayPeriodName } )
                });
                
                let weightAgeCategories = data[OptionsNames.WEIGHT_AGE_CATEGORIES];
                let wac = [];
                wac.push( { value: null, label: "-" } );
                weightAgeCategories.forEach(weightAgeCategory => {
                    wac.push( { value: weightAgeCategory.id, label: weightAgeCategory.categoryName } )
                });                
                
                this.setState({ 
                    roomTypes: rt,
                    stayPeriods: sp,
                    weightAgeCategories: wac
                });
            });
        });               
    }

    loadItemToUpdate()
    {        
        fetch(TOURNAMENT_REGISTRATIONS + "/" + this.props.itemId, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        })
        .then(response => response.json())
        .then(data => { 
            let rt;
            if ( data.roomType == null )
                rt = {
                    value: null,
                    label: "-"
                }
            else 
                rt = {
                    value: data.roomType.id,
                    label: data.roomType.roomTypeName
                }

            let sp;
            if ( data.stayPeriod == null )
                sp = {
                    value: null,
                    label: "-"
                }
            else
                sp = {
                    value: data.stayPeriod.id,
                    label: data.stayPeriod.stayPeriodName
                }

            let wac;
            if ( data.weightAgeCategory == null )
                wac = {
                    value: null,
                    label: "-"
                }
            else
                wac = {
                    value: data.weightAgeCategory.id,
                    label: data.weightAgeCategory.categoryName
                }

            this.setState({ itemToUpdate: {...data, roomType: rt, stayPeriod: sp, weightAgeCategory: wac} });
        })
    }

    handleUpdateRegistration(e)
    {
        e.preventDefault();

        let rt;
        if ( this.state.itemToUpdate.roomType.value == null && this.state.itemToUpdate.roomType.label == "-" )
            rt = null;
        else
            rt = {
                id: this.state.itemToUpdate.roomType.value,
                roomTypeName: this.state.itemToUpdate.roomType.label
            };

        let sp;
        if ( this.state.itemToUpdate.stayPeriod.value == null && this.state.itemToUpdate.stayPeriod.label == "-" )
            sp = null;
        else
            sp = {
                id: this.state.itemToUpdate.stayPeriod.value,
                stayPeriodName: this.state.itemToUpdate.stayPeriod.label
            };

        let wac;
        if ( this.state.itemToUpdate.weightAgeCategory.value == null && this.state.itemToUpdate.weightAgeCategory.label == "-" )
            wac = null;
        else
            wac = {
                id: this.state.itemToUpdate.weightAgeCategory.value,
                roomTypeName: this.state.itemToUpdate.weightAgeCategory.label
            };
                
        let itemToUpdate = {...this.state.itemToUpdate, roomType: rt, stayPeriod: sp, weightAgeCategory: wac };
        
        fetch(Urls.WEBSERVICE_URL + "/teams/" + itemToUpdate.team.id  + "/tournament_registrations", {
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
        const selectStyles = {
            container: base => ({
                ...base,
                flex : 1,                
            })
        };

        const t = this.props.t;

        return (
            currentUser != null && ( currentUser.roles.includes("ROLE_TRAINER")) ?
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
                            <Card.Header>{t("administrative_tools")}</Card.Header>
                            <Card.Body>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="4">{t("fee_received")}</Form.Label>
                                    <Col sm="8" style={{display: "flex", alignItems: "center"}}>
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
                                    <Form.Label column sm="4">{t("as_judge")}</Form.Label>
                                    <Col sm="8" style={{display: "flex", alignItems: "center"}}>
                                        <Form.Check 
                                            type="checkbox"
                                            name="asJudgeParticipation" 
                                            style={{display: "flex", alignItems: "center"}}
                                            checked={this.state.itemToUpdate.asJudgeParticipation}
                                            onChange={e => { 
                                                this.setState({ 
                                                    itemToUpdate: {...this.state.itemToUpdate, 
                                                        asJudgeParticipation: e.target.checked,
                                                        weightAgeCategory: { value: null, label : "-" }
                                                    } 
                                                }) 
                                            }}
                                        />
                                    </Col>
                                </Form.Group>
                                {this.props.sayonaraMeeting && (
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="4">{t("sayonara")}</Form.Label>
                                        <Col sm="8" style={{display: "flex", alignItems: "center"}}>
                                            <Form.Check 
                                                type="checkbox"
                                                name="sayonaraMeetingParticipation" 
                                                style={{display: "flex", alignItems: "center"}}
                                                checked={this.state.itemToUpdate.sayonaraMeetingParticipation}
                                                onChange={e => { this.setState({ itemToUpdate: {...this.state.itemToUpdate, sayonaraMeetingParticipation: e.target.checked} }) }}
                                            />
                                        </Col>
                                    </Form.Group>
                                )}
                                {this.props.accommodation && (
                                    <div>
                                        <Form.Group as={Row}>
                                        <Form.Label column sm="4">{t("accommodation")}</Form.Label>
                                            <Col sm="8" style={{display: "flex", alignItems: "center"}}>
                                                <Form.Check 
                                                    type="checkbox"
                                                    name="accommodation" 
                                                    style={{display: "flex", alignItems: "center"}}
                                                    checked={this.state.itemToUpdate.accommodation}
                                                    onChange={e => { 
                                                        this.setState({ 
                                                            itemToUpdate: {...this.state.itemToUpdate, 
                                                                accommodation: e.target.checked,
                                                                roomType: { value: null, label : "-" },
                                                                stayPeriod: { value: null, label : "-" }
                                                            } 
                                                        }) 
                                                    }}
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="4">{t("room_type")}</Form.Label>
                                            <Col sm="8" style={{display: "flex", alignItems: "center"}}>
                                                <Select
                                                    styles={selectStyles}
                                                    options={this.state.roomTypes}                                    
                                                    value={this.state.itemToUpdate.roomType}
                                                    onChange={roomType => {                                        
                                                        this.setState({ itemToUpdate: {...this.state.itemToUpdate, roomType: roomType} })                                        
                                                    }}
                                                    isDisabled={!this.state.itemToUpdate.accommodation}
                                                />
                                            </Col>
                                        </Form.Group> 
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="4">{t("stay_period")}</Form.Label>
                                            <Col sm="8" style={{display: "flex", alignItems: "center"}}>
                                                <Select
                                                    styles={selectStyles}
                                                    options={this.state.stayPeriods}                                    
                                                    value={this.state.itemToUpdate.stayPeriod}
                                                    onChange={stayPeriod => {                                        
                                                        this.setState({ itemToUpdate: {...this.state.itemToUpdate, stayPeriod: stayPeriod} })                                        
                                                    }}
                                                    isDisabled={!this.state.itemToUpdate.accommodation}
                                                />
                                            </Col>
                                        </Form.Group> 
                                    </div>
                                )}                            
                                <Form.Group as={Row}>
                                    <Form.Label column sm="4">{t("weight_age_category")}</Form.Label>
                                    <Col sm="8" style={{display: "flex", alignItems: "center"}}>
                                        <Select
                                            styles={selectStyles}
                                            options={this.state.weightAgeCategories}                                    
                                            value={this.state.itemToUpdate.weightAgeCategory}
                                            onChange={weightAgeCategory => {                                        
                                                this.setState({ itemToUpdate: {...this.state.itemToUpdate, weightAgeCategory: weightAgeCategory} })                                        
                                            }}
                                            isDisabled={this.state.itemToUpdate.asJudgeParticipation}
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
            ) : (
                <Alert variant="danger">
                    <Alert.Heading>Access denided</Alert.Heading>
                    <p>You have no priviledges granted to view this section.</p>
                </Alert> 
            )
        );
    }
}

export default withTranslation()(EditTournamentRegistrationModal);