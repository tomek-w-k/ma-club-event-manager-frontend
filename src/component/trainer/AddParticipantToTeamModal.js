import React, {Component} from "react";
import {
    Modal, 
    Form,
    Button,
    Row,
    Col,
    Container,  
    Card, 
    Alert,
    Popover,
    Tooltip,
    OverlayTrigger,
    Image
    } from "react-bootstrap";
import Select from "react-select";
import AuthService from "../../service/auth-service";
import * as Urls from "../../servers-urls";


const currentUser = AuthService.getCurrentUser();
const TOURNAMENT_REGISTRATION_API_URL = Urls.WEBSERVICE_URL + "/tournament_registrations";
const USERS_API_URL = Urls.WEBSERVICE_URL + "/users";
const TOURNAMENT_EVENTS = Urls.WEBSERVICE_URL + "/tournament_events"; 
const TOURNAMENT_REGISTRATIONS = Urls.WEBSERVICE_URL + "/tournament_registrations"; 


class AddParticipantToTeamModal extends Component
{
    constructor(props)
    {        
        super(props);
        this.state = {
            tournamentRegistration: {
                id: null,
                user: {
                    fullName: "",
                    email: ""
                },
                feeReceived: false,
                sayonaraMeetingParticipation: false,
                accommodation: false,
                roomType: {
                    value: null,
                    label: ""
                },
                stayPeriod: {
                    value: null,
                    label: ""
                },
                asJudgeParticipation: false,
                weightAgeCategory: {
                    value: null,
                    label: ""
                },
                team: {
                    id: this.props.teamId                    
                }
            },
            errorMessage: false,            
            formValidated: false,
            roomTypes: [],
            stayPeriods: [],
            weightAgeCategories: [],          
        }        
        this.handleSignUp = this.handleSignUp.bind(this);        
        this.handleClearForm = this.handleClearForm.bind(this);
    }

    componentDidMount()
    {    
        let requests = [];  
        
        const OptionsNames = Object.freeze ({
            ROOM_TYPES: 0,
            STAY_PERIODS: 1,
            WEIGHT_AGE_CATEGORIES: 2
        });

        requests.push(fetch(TOURNAMENT_EVENTS + "/" + this.props.eventId + "/room_types"));
        requests.push(fetch(TOURNAMENT_EVENTS + "/" + this.props.eventId + "/stay_periods"));
        requests.push(fetch(TOURNAMENT_EVENTS + "/" + this.props.eventId + "/weight_age_categories"));
        
        Promise.all(requests)
        .then(responses =>  responses.map(response => response.json()) )
        .then(jsonResponses => {            
            Promise.all(jsonResponses)
            .then(data => { 
                let roomTypes = data[OptionsNames.ROOM_TYPES];
                let rt = [];
                rt.push( { value: null, label: "-" } );
                roomTypes.forEach(roomType => {
                    rt.push( { value: roomType.id, label: 
                        <OverlayTrigger trigger="hover" placement="top" overlay={(                            
                            <Popover>
                                <Popover.Content>
                                    <div style={{ backgroundColor: "red"}}>
                                        <Image src={roomType.roomTypePicturePath} style={{maxWidth: "400px", maxHeight: "400px"}} />
                                    </div>                                    
                                </Popover.Content>
                            </Popover>
                        )}>
                            <div>{roomType.roomTypeName}</div>                            
                        </OverlayTrigger>
                    })
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

    handleClearForm()
    {
        this.setState({
            tournamentRegistration: {
                id: null,
                user: {
                    fullName: "",
                    email: ""
                },
                feeReceived: false,
                sayonaraMeetingParticipation: false,
                accommodation: false,
                roomType: {
                    value: null,
                    label: ""
                },
                stayPeriod: {
                    value: null,
                    label: ""
                },
                asJudgeParticipation: false,
                weightAgeCategory: {
                    value: null,
                    label: ""
                },
                team: {
                    id: this.props.teamId                    
                }
            }, 
            errorMessage: false,   
            formValidated: false,
            selectedRowsIds: []
        });
    }
    
    handleSignUp(e)
    {
        e.preventDefault();
        
        if ( e.currentTarget.checkValidity() )
        {
            this.setState({ formValidated: true });

            let rt;
            if ( this.state.tournamentRegistration.roomType.value == null && 
                    (this.state.tournamentRegistration.roomType.label == "-" || this.state.tournamentRegistration.roomType.label == "") )
                rt = null;
            else
                rt = {
                    id: this.state.tournamentRegistration.roomType.value,
                    roomTypeName: this.state.tournamentRegistration.roomType.label.props ?
                    this.state.tournamentRegistration.roomType.label.props.children.props.children : this.state.tournamentRegistration.roomType.label
                };

            let sp;
            if ( this.state.tournamentRegistration.stayPeriod.value == null && 
                    (this.state.tournamentRegistration.stayPeriod.label == "-" || this.state.tournamentRegistration.stayPeriod.label == "") )
                sp = null;
            else
                sp = {
                    id: this.state.tournamentRegistration.stayPeriod.value,
                    stayPeriodName: this.state.tournamentRegistration.stayPeriod.label
                };

            let wac;
            if ( this.state.tournamentRegistration.weightAgeCategory.value == null && 
                    (this.state.tournamentRegistration.weightAgeCategory.label == "-" || this.state.tournamentRegistration.weightAgeCategory.label == "") )
                wac = null;
            else
                wac = {
                    id: this.state.tournamentRegistration.weightAgeCategory.value,
                    stayPeriodName: this.state.tournamentRegistration.weightAgeCategory.label
                };

            let user = {
                fullName: this.props.signUpMe ? "current user" : this.state.tournamentRegistration.user.fullName,
                email: this.props.signUpMe ? currentUser.email : this.state.tournamentRegistration.user.email
            };

            let tournamentRegistration = {...this.state.tournamentRegistration, 
                roomType: rt,
                stayPeriod: sp,
                weightAgeCategory: wac,
                user: user
            }; 
            
            fetch(Urls.WEBSERVICE_URL + "/teams/" + this.props.teamId  + "/tournament_registrations", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(tournamentRegistration)           
            })            
            .then(result => {            
                return new Promise((resolve, reject) => {
                    if(result.ok)
                        resolve()
                    else reject(result);                    
                })    
            },
            error => { console.log("Error - Participant not added.") })    
            .then( () => this.props.onHide(),
            error => error.json().then(text => this.setState({ errorMessage: text.message }) ) );
        }        
        else this.setState({ formValidated: true });       
    }

    render()
    {
        const selectStyles = {
            container: base => ({
                ...base,
                flex: 1,                
            })
        };

        const mouseOver = i => {
            console.log(i);
        }
        
        return (
            currentUser != null && currentUser.roles.includes("ROLE_TRAINER") ?
            (
                <Modal 
                    show={this.props.show}                
                    onHide={this.props.onHide}
                    onEnter={() => this.handleClearForm()}                
                    animation="true"
                    size="lg"
                    centered="true"                
                >                
                <Form noValidate validated={this.state.formValidated} onSubmit={this.handleSignUp}>
                    <Modal.Header>
                        {this.props.signUpMe ? <div>SIGN UP ME</div> : <div>SIGN UP PARTICIPANT</div>}  
                    </Modal.Header>
                    <Modal.Body>                        
                            {!this.props.signUpMe && (
                                <Card>
                                    <Card.Header>PERSONAL DETAILS</Card.Header>
                                    <Card.Body>
                                        {this.state.errorMessage && (<Alert variant="danger">{this.state.errorMessage}</Alert>)}
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="4">Full name</Form.Label>
                                            <Col sm="8">
                                                <Form.Control required
                                                    type="text"
                                                    name="user.fullName"                                    
                                                    value={this.state.tournamentRegistration.user.fullName}
                                                    onChange={(e) => { this.setState({ 
                                                        tournamentRegistration: {...this.state.tournamentRegistration, 
                                                            user: {
                                                                fullName: e.target.value,
                                                                email: this.state.tournamentRegistration.user.email
                                                            }
                                                        }}
                                                    ) }}                            
                                                />
                                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">Please provide a full name.</Form.Control.Feedback>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="4">Email</Form.Label>
                                            <Col sm="8">
                                                <Form.Control required
                                                    type="email"
                                                    name="email"                                        
                                                    value={this.state.tournamentRegistration.user.email}
                                                    onChange={(e) => { this.setState({ 
                                                        tournamentRegistration: {...this.state.tournamentRegistration, 
                                                            user: {
                                                                fullName: this.state.tournamentRegistration.user.fullName,
                                                                email: e.target.value
                                                            }
                                                        }}
                                                    ) }}                            
                                                />
                                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">Please provide a valid email.</Form.Control.Feedback>
                                            </Col>                                
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            )}
                            <div style={{height: "16px"}}></div>
                            {this.props.signUpMe && this.state.errorMessage && (<Alert variant="danger">{this.state.errorMessage}</Alert>)}
                            <Card >
                                <Card.Header>REGISTRATION OPTIONS</Card.Header>
                                <Card.Body>                                    
                                    <Form.Group as={Row} >
                                        <Form.Label column sm="4">As a judge participation</Form.Label>
                                        <Col sm="8" style={{display: "flex", alignItems: "center"}}>
                                            <Form.Check 
                                                type="checkbox"
                                                name="asJudgeParticipation"                                    
                                                checked={this.state.tournamentRegistration.asJudgeParticipation}
                                                onChange={e => { 
                                                    this.setState({ 
                                                        tournamentRegistration: {...this.state.tournamentRegistration, 
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
                                            <Form.Label column sm="4">Sayonara participation</Form.Label>
                                            <Col sm="8" style={{display: "flex", alignItems: "center"}}>
                                                <Form.Check 
                                                    type="checkbox"
                                                    name="sayonaraMeetingParticipation" 
                                                    style={{display: "flex", alignItems: "center"}}
                                                    checked={this.state.tournamentRegistration.sayonaraMeetingParticipation}
                                                    onChange={e => { 
                                                        this.setState({ 
                                                            tournamentRegistration: {...this.state.tournamentRegistration, sayonaraMeetingParticipation: e.target.checked} 
                                                        }) 
                                                    }}
                                                />
                                            </Col>
                                        </Form.Group>
                                    )}                            
                                    {this.props.accommodation && (
                                        <div>
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="4">Accommodation</Form.Label>
                                                <Col sm="8" style={{display: "flex", alignItems: "center"}}>
                                                    <Form.Check 
                                                        type="checkbox"
                                                        name="accommodation" 
                                                        style={{display: "flex", alignItems: "center"}}
                                                        checked={this.state.tournamentRegistration.accommodation}
                                                        onChange={e => { 
                                                            this.setState({ 
                                                                tournamentRegistration: {...this.state.tournamentRegistration, 
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
                                                <Form.Label column sm="4">Room type</Form.Label>
                                                <Col sm="8" style={{display: "flex", alignItems: "center"}}>
                                                    <Select
                                                        styles={selectStyles}
                                                        options={this.state.roomTypes}                                    
                                                        value={this.state.tournamentRegistration.roomType}
                                                        onChange={roomType => {                                                                                             
                                                            this.setState({ tournamentRegistration: {...this.state.tournamentRegistration, roomType: roomType} })                                        
                                                        }}
                                                        isDisabled={!this.state.tournamentRegistration.accommodation}
                                                        
                                                    />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="4">Stay period</Form.Label>
                                                <Col sm="8" style={{display: "flex", alignItems: "center"}}>
                                                    <Select
                                                        styles={selectStyles}
                                                        options={this.state.stayPeriods}                                    
                                                        value={this.state.tournamentRegistration.stayPeriod}
                                                        onChange={stayPeriod => {                                        
                                                            this.setState({ tournamentRegistration: {...this.state.tournamentRegistration, stayPeriod: stayPeriod} })                                        
                                                        }}
                                                        isDisabled={!this.state.tournamentRegistration.accommodation}
                                                    />
                                                </Col>
                                            </Form.Group>
                                        </div>                                
                                    )}                        
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="4">Weight / age category</Form.Label>
                                        <Col sm="8" style={{display: "flex", alignItems: "center"}}>
                                            <Select
                                                styles={selectStyles}
                                                options={this.state.weightAgeCategories}                                    
                                                value={this.state.tournamentRegistration.weightAgeCategory}
                                                onChange={weightAgeCategory => {                                        
                                                    this.setState({ tournamentRegistration: {...this.state.tournamentRegistration, weightAgeCategory: weightAgeCategory} })                                        
                                                }}
                                                isDisabled={this.state.tournamentRegistration.asJudgeParticipation}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <Button variant="info" type="submit">Sign up</Button>{' '}                            
                            <Button variant="secondary" onClick={this.props.onHide}>Cancel</Button>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
            ): (<h2>You do not have priviledges  granted to view this section.</h2 >)
        );
    }
}

export default AddParticipantToTeamModal;