import React, {Component} from "react";
import {
    Modal, 
    Form,
    Button,
    Row,
    Container
    } from "react-bootstrap";
import Select from "react-select";
import AuthService from "../service/auth-service";
import * as Urls from "../servers-urls";


const currentUser = AuthService.getCurrentUser();
const TOURNAMENT_EVENTS = Urls.WEBSERVICE_URL + "/tournament_events"; 
const TOURNAMENT_REGISTRATIONS = Urls.WEBSERVICE_URL + "/tournament_registrations"; 


class TournamentRegistrationOptionChooserModal extends Component
{
    constructor(props)
    {        
        super(props);
        this.state = {
            tournamentRegistration: {
                id: null,
                user: null,
                feeReceived: false,
                sayonaraMeetingParticipation: false,
                accommodation: false,
                roomType: {
                    value: null,
                    label : ""
                },
                stayPeriod: {
                    value: null,
                    label : ""
                },
                asJudgeParticipation: false,
                weightAgeCategory: {
                    value: null,
                    label: ""
                },
                accommodation: false,
                tournamentEvent: {
                    id: this.props.eventId                    
                }
            },
            roomTypes: [],
            stayPeriods: [],
            weightAgeCategories: [],
            selectedRowsIds: []
        }        
        this.handleSignUp = this.handleSignUp.bind(this); 
        this.handleClearForm = this.handleClearForm.bind(this);
    }

    componentDidMount()
    {        
        fetch(TOURNAMENT_EVENTS + "/" + this.props.eventId + "/room_types", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        })
        .then(response => response.json())
        .then((data) => {                
            let rt = [];
            rt.push( { value: null, label: "-" } );
            data.map((roomType) => {
                rt.push( { value: roomType.id, label: roomType.roomTypeName } )
            })                
            this.setState({ roomTypes: rt });
        });

        fetch(TOURNAMENT_EVENTS + "/" + this.props.eventId + "/stay_periods", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        })
        .then(response => response.json())
        .then((data) => {                
            let sp = [];
            sp.push( { value: null, label: "-" } );
            data.map((stayPeriod) => {
                sp.push( { value: stayPeriod.id, label: stayPeriod.stayPeriodName } )
            })                
            this.setState({ stayPeriods: sp });
        });

        fetch(TOURNAMENT_EVENTS + "/" + this.props.eventId + "/weight_age_categories", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        })
        .then(response => response.json())
        .then((data) => {                
            let wac = [];
            wac.push( { value: null, label: "-" } );
            data.map((weightAgeCategory) => {
                wac.push( { value: weightAgeCategory.id, label: weightAgeCategory.categoryName } )
            })                
            this.setState({ weightAgeCategories: wac });
        });
    }

    handleClearForm()
    {
        this.setState({
            tournamentRegistration: {
                id: null,
                user: null,
                feeReceived: false,
                sayonaraMeetingParticipation: false,
                accommodation: false,
                roomType: {
                    value: null,
                    label : ""
                },
                stayPeriod: {
                    value: null,
                    label : ""
                },
                asJudgeParticipation: false,
                weightAgeCategory: {
                    value: null,
                    label: ""
                },
                accommodation: false,
                tournamentEvent: {
                    id: this.props.eventId                    
                }
            },            
            selectedRowsIds: []
        });
    }
    
    handleSignUp(e)
    {
        e.preventDefault();
        
        let rt;
        if ( this.state.tournamentRegistration.roomType.value == null && 
                (this.state.tournamentRegistration.roomType.label == "-" || this.state.tournamentRegistration.roomType.label == "") )
            rt = null;
        else
            rt = {
                id: this.state.tournamentRegistration.roomType.value,
                roomTypeName: this.state.tournamentRegistration.roomType.label
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
                categoryName: this.state.tournamentRegistration.weightAgeCategory.label
            };
        
        let tournamentRegistration = {...this.state.tournamentRegistration, roomType: rt, stayPeriod: sp, weightAgeCategory: wac, user: {id: currentUser.id}};            
           console.log(tournamentRegistration);
        fetch(TOURNAMENT_REGISTRATIONS, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentUser.accessToken
            },
            body: JSON.stringify(tournamentRegistration)           
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
        const selectStyles = {
            container: base => ({
                ...base,
                flex: 1,                
            })
        };

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
                    <Modal.Header>
                        Add a participant
                    </Modal.Header>
                    <Modal.Body>
                        <Container>                            
                            <Form.Group as={Row}>
                                <Form.Label column sm="4">I will participate as a judge</Form.Label>
                                <Form.Check column sm="4"
                                    type="checkbox"
                                    name="asJudgeParticipation" 
                                    style={{display: "flex", alignItems: "center"}}
                                    checked={this.state.tournamentRegistration.asJudgeParticipation}
                                    onChange={e => {
                                        this.setState({
                                            tournamentRegistration: {...this.state.tournamentRegistration,
                                                asJudgeParticipation: e.target.checked,
                                                weightAgeCategory: { value: null, label: "" }
                                            } 
                                        })  
                                    }}
                                />
                            </Form.Group>
                            {this.props.sayonaraMeeting && (
                                <Form.Group as={Row}>
                                    <Form.Label column sm="4">Sayonara participation</Form.Label>
                                    <Form.Check column sm="4"
                                        type="checkbox"
                                        name="sayonaraMeetingParticipation" 
                                        style={{display: "flex", alignItems: "center"}}
                                        checked={this.state.tournamentRegistration.sayonaraMeetingParticipation}
                                        onChange={e => {this.setState({tournamentRegistration: {...this.state.tournamentRegistration, sayonaraMeetingParticipation: e.target.checked} }) }}
                                    />
                                </Form.Group>
                            )}  
                            {this.props.accommodation && (
                                <div>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="4">Accommodation</Form.Label>
                                        <Form.Check column sm="4"
                                            type="checkbox"
                                            name="accommodation" 
                                            style={{display: "flex", alignItems: "center"}}
                                            checked={this.state.tournamentRegistration.accommodation}
                                            onChange={e => { 
                                                this.setState({ 
                                                    tournamentRegistration: {...this.state.tournamentRegistration, 
                                                        accommodation: e.target.checked,
                                                        roomType: { value: null, label : "" },
                                                        stayPeriod: { value: null, label : "" }                                                        
                                                    } 
                                                }) 
                                            }}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="4">Room type</Form.Label>
                                        <Select
                                            styles={selectStyles}
                                            options={this.state.roomTypes}                                    
                                            value={this.state.tournamentRegistration.roomType}
                                            onChange={roomType => {                                        
                                                this.setState({ tournamentRegistration: {...this.state.tournamentRegistration, roomType: roomType} })                                        
                                            }}
                                            isDisabled={!this.state.tournamentRegistration.accommodation}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="4">Stay period</Form.Label>
                                        <Select
                                            styles={selectStyles}
                                            options={this.state.stayPeriods}                                    
                                            value={this.state.tournamentRegistration.stayPeriod}
                                            onChange={stayPeriod => {                                        
                                                this.setState({ tournamentRegistration: {...this.state.tournamentRegistration, stayPeriod: stayPeriod} })                                        
                                            }}
                                            isDisabled={!this.state.tournamentRegistration.accommodation}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="4">Weight / age category</Form.Label>
                                        <Select
                                            styles={selectStyles}
                                            options={this.state.weightAgeCategories}                                    
                                            value={this.state.tournamentRegistration.weightAgeCategory}
                                            onChange={weightAgeCategory => {                                        
                                                this.setState({ tournamentRegistration: {...this.state.tournamentRegistration, weightAgeCategory: weightAgeCategory} })                                        
                                            }}
                                            isDisabled={this.state.tournamentRegistration.asJudgeParticipation}
                                        />
                                    </Form.Group>
                                </div>
                            )}  
                        </Container>                                               
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <Button variant="info" type="submit">Save</Button>{' '}                            
                            <Button variant="secondary" onClick={this.props.onHide}>Cancel</Button>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
            ): (<h2>You do not have priviledges  granted to view this section.</h2 >)
        );
    }
}

export default TournamentRegistrationOptionChooserModal;