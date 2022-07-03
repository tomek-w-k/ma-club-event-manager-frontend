import React, {Component} from "react";
import {
    Card,
    Form,    
    Col,   
    Row, 
    Button,
    Alert,
} from "react-bootstrap";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();  
const TOURNAMENT_EVENTS_API_URL = Urls.WEBSERVICE_URL + "/tournament_events";


class AddTournament extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            event: {
                id: null,
                eventName: "",
                eventDescription: "",
                eventPicturePath: "",               
                startDate: "",
                endDate: "",
                sayonaraMeeting: false,
                accommodation: false,
                roomTypes: [
                    {
                        roomTypeName: ""
                    }
                ],
                stayPeriods: [
                    {
                        stayPeriodName: ""
                    }
                ],
                weightAgeCategories: [
                    {
                        categoryName: ""
                    }
                ],
                tournamentRegistrations: []
            },
            errorMessage: null,
            formValidated: false
        }

        this.handleAddEvent = this.handleAddEvent.bind(this);

        this.handleChangeRoomTypeFields = this.handleChangeRoomTypeFields.bind(this);
        this.handleAddRoomTypeField = this.handleAddRoomTypeField.bind(this);
        this.handleRemoveRoomTypeField = this.handleRemoveRoomTypeField.bind(this);
        

        this.handleChangeStayPeriodFields = this.handleChangeStayPeriodFields.bind(this);
        this.handleAddStayPeriodField = this.handleAddStayPeriodField.bind(this);
        this.handleRemoveStayPeriodField = this.handleRemoveStayPeriodField.bind(this);
        

        this.handleChangeWeightAgeCategoryFields = this.handleChangeWeightAgeCategoryFields.bind(this);
        this.handleAddWeightAgeCategoryField = this.handleAddWeightAgeCategoryField.bind(this);
        this.handleRemoveWeightAgeCategoryField = this.handleRemoveWeightAgeCategoryField.bind(this);
        
    }

    handleAddEvent(e)
    {
        e.preventDefault();
        if ( e.currentTarget.checkValidity() )
        {            
            this.setState({ formValidated: true });

            let tournamentToSave = {...this.state.event, startDate: e.target.startDate.value, endDate: e.target.endDate.value};

            if ( !this.state.event.accommodation )
                tournamentToSave = {...tournamentToSave, roomTypes: [], stayPeriods: [] };

            fetch(TOURNAMENT_EVENTS_API_URL,{
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + currentUser.accessToken
                },
                body: JSON.stringify( tournamentToSave )
            })        
            .then(result => {
                if ( result.ok ) {
                    this.props.history.push("/event_wall_component");
                    window.location.reload();
                } 
                else return result.json();            
            },
            error => { this.setState({ errorMessage: error.message }) })            
            .then( result => { 
                if (typeof result !== 'undefined')
                    this.setState({ errorMessage: result.message });                
            });
        }
        else this.setState({ 
            formValidated: true,
            errorMessage: "Please fill all required fields."
        });
    }

    handleChangeRoomTypeFields(index, event)
    {
        const values = this.state.event.roomTypes;
        values[index][event.target.name] = event.target.value;
        this.setState({ event: {...this.state.event, roomTypes: values} });        
    }

    handleAddRoomTypeField(index)
    {         
        const roomTypeFields = [...this.state.event.roomTypes];
        roomTypeFields.splice(index+1, 0, { roomTypeName: "" });        
        this.setState({ event: {...this.state.event, roomTypes: roomTypeFields} });
    }

    handleRemoveRoomTypeField(index)
    {
        if ( this.state.event.roomTypes.length > 1 )
        {
            const roomTypeFields = [...this.state.event.roomTypes];
            roomTypeFields.splice(index, 1);
            this.setState({ event: {...this.state.event, roomTypes: roomTypeFields} });            
        }
    }

    handleChangeStayPeriodFields(index, event)
    {
        const values = this.state.event.stayPeriods;
        values[index][event.target.name] = event.target.value;
        this.setState({ event: {...this.state.event, stayPeriods: values} });        
    }

    handleAddStayPeriodField(index)
    {         
        const stayPeriodFields = [...this.state.event.stayPeriods];
        stayPeriodFields.splice(index+1, 0, { stayPeriodName: "" });
        this.setState({ event: {...this.state.event, stayPeriods: stayPeriodFields} });       
    }

    handleRemoveStayPeriodField(index)
    {
        if ( this.state.event.stayPeriods.length > 1 )
        {
            const stayPeriodFields = [...this.state.event.stayPeriods];
            stayPeriodFields.splice(index, 1);
            this.setState({ event: {...this.state.event, stayPeriods: stayPeriodFields} });            
        }
    }

    handleChangeWeightAgeCategoryFields(index, event)
    {
        const values = this.state.event.weightAgeCategories;
        values[index][event.target.name] = event.target.value;
        this.setState({ event: {...this.state.event, weightAgeCategories: values} });        
    }

    handleAddWeightAgeCategoryField(index)
    {         
        const weightAgeCategoryFields = [...this.state.event.weightAgeCategories];
        weightAgeCategoryFields.splice(index+1, 0, { categoryName: "" });        
        this.setState({ event: {...this.state.event, weightAgeCategories: weightAgeCategoryFields} });       
    }

    handleRemoveWeightAgeCategoryField(index)
    {
        if ( this.state.event.weightAgeCategories.length > 1 )
        {
            const weightAgeCategoryFields = [...this.state.event.weightAgeCategories];
            weightAgeCategoryFields.splice(index, 1);
            this.setState({ event: {...this.state.event, weightAgeCategories: weightAgeCategoryFields} });            
        }
    }

    render()
    {
        const t = this.props.t;
      
        this.props.navbarControlsHandler();
        
        return(
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            ( 
                <div>
                    {this.state.errorMessage && (<Alert variant="danger">{this.state.errorMessage}</Alert>)}
                    <Card>
                        <Card.Body>
                            <Card.Text>                            
                            <Form noValidate validated={this.state.formValidated} onSubmit={this.handleAddEvent}>                            
                                    <Form.Group>
                                        <Form.Label>{t("name")}</Form.Label>
                                        <Form.Control required
                                            type="text"
                                            name="eventName"
                                            value={this.state.event.eventName}
                                            onChange={(e) => { this.setState({ event: {...this.state.event, eventName: e.target.value} }) }}                            
                                        />
                                    </Form.Group>
                                    <Form.Row>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>{t("from")}</Form.Label>
                                                <Datetime                                             
                                                    inputProps={{name: "startDate", autoComplete: "off", required: "true"}}
                                                    value={this.state.event.startDate}
                                                    onChange={(date) => {this.setState({ event: {...this.state.event, startDate: date} }) }}                                         
                                                    dateFormat="DD-MM-YYYY"
                                                    timeFormat="HH:mm:ss"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>{t("to")}</Form.Label>
                                                <Datetime required
                                                    inputProps={{ name: "endDate", autoComplete: "off", required: "true"}}
                                                    value={this.state.event.endDate}
                                                    onChange={(date) => {this.setState({ event: {...this.state.event, endDate: date} }) }} 
                                                    dateFormat="DD-MM-YYYY"
                                                    timeFormat="HH:mm:ss"
                                                />
                                            </Form.Group>
                                        </Col>                            
                                    </Form.Row>
                                    <Form.Group>
                                        <Form.Label>{t("description")}</Form.Label>
                                        <Form.Control 
                                            as="textarea"
                                            name="eventDescription"
                                            value={this.state.event.eventDescription}
                                            onChange={(e) => { this.setState({ event: {...this.state.event, eventDescription: e.target.value} }) }}
                                        />
                                    </Form.Group>
                                    <Form.Group >
                                        <Row>
                                        <Form.Label column sm="3">{t("sayonara_meeting")}</Form.Label>
                                        <Form.Check 
                                            type="checkbox"
                                            name="sayonaraMeeting"
                                            style={{display: "flex", alignItems: "center"}}
                                            checked={this.state.event.sayonaraMeeting}
                                            onChange={(e) => { this.setState({ event: {...this.state.event, sayonaraMeeting: e.target.checked} }) }}
                                        />
                                        </Row>
                                    </Form.Group>
                                    <Form.Group >
                                        <Row>
                                            <Form.Label column sm="3">{t("accommodation")}</Form.Label>
                                            <Form.Check 
                                                type="checkbox"
                                                name="accommodation"
                                                style={{display: "flex", alignItems: "center"}}
                                                checked={this.state.event.accommodation}
                                                disabled={this.state.disableAccommodation}
                                                onChange={(e) => { 
                                                    if ( e.target.checked )
                                                        this.setState({ 
                                                            event: {...this.state.event, 
                                                                accommodation: e.target.checked,
                                                                roomTypes: [{ roomTypeName: "" }],
                                                                stayPeriods: [{ stayPeriodName: "" }]
                                                            } 
                                                        });     
                                                    else 
                                                        this.setState({ 
                                                            event: {...this.state.event, 
                                                                accommodation: e.target.checked,
                                                                roomTypes: [],
                                                                stayPeriods: []
                                                            } 
                                                        });                                                    
                                                }}
                                            />
                                        </Row>
                                    </Form.Group>
                                    {this.state.event.accommodation && (
                                        <div>
                                            <Form.Row>
                                                <Col><Form.Label>{t("room_types")}</Form.Label></Col>
                                            </Form.Row>
                                            {   
                                                this.state.event.roomTypes.map( (roomTypeInputField, index) => (
                                                    <div key={index}>
                                                        <Form.Row>
                                                            <Col>
                                                                <Form.Control 
                                                                    required={this.state.event.accommodation}
                                                                    type="text" 
                                                                    name="roomTypeName" 
                                                                    value={roomTypeInputField.roomTypeName} 
                                                                    onChange={event => this.handleChangeRoomTypeFields(index, event)}
                                                                    style={{marginBottom: "10px"}}
                                                                />
                                                            </Col>                                                                                                           
                                                            <Col className="col-md-auto">
                                                                <Button variant="danger" 
                                                                        onClick={() => this.handleRemoveRoomTypeField(index)}                                                                       
                                                                        
                                                                >-</Button>
                                                            </Col>
                                                            <Col className="col-md-auto">
                                                                <Button  
                                                                        variant="info" 
                                                                        onClick={() => this.handleAddRoomTypeField(index)} 
                                                                >+</Button>
                                                            </Col>                                        
                                                        </Form.Row>
                                                    </div>
                                                ) )
                                            }
                                            <br />
                                            <Form.Row>
                                                <Col><Form.Label>{t("stay_periods")}</Form.Label></Col>
                                            </Form.Row>
                                            {
                                                this.state.event.stayPeriods.map( (stayPeriodInputField, index) => (
                                                    <div key={index}>
                                                        <Form.Row>
                                                            <Col>
                                                                <Form.Control 
                                                                    required={this.state.event.accommodation}
                                                                    type="text" 
                                                                    name="stayPeriodName" 
                                                                    value={stayPeriodInputField.stayPeriodName} 
                                                                    onChange={event => this.handleChangeStayPeriodFields(index, event)}
                                                                    style={{marginBottom: "10px"}}
                                                                />
                                                            </Col>                                                    
                                                            <Col className="col-md-auto">
                                                                <Button variant="danger" 
                                                                        onClick={() => this.handleRemoveStayPeriodField(index)}                                                                        
                                                                >-</Button>
                                                            </Col>
                                                            <Col className="col-md-auto">
                                                                <Button  
                                                                        variant="info" 
                                                                        onClick={() => this.handleAddStayPeriodField(index)} 
                                                                >+</Button>
                                                            </Col>                                        
                                                        </Form.Row>
                                                    </div>
                                                ) )
                                            }
                                            <br />
                                        </div>
                                    )}
                                    <Form.Row>
                                        <Col><Form.Label>{t("weight_age_categories")}</Form.Label></Col>
                                    </Form.Row>
                                    {
                                        this.state.event.weightAgeCategories.map( (weightAgeCategoryInputField, index) => (
                                            <div key={index}>
                                                <Form.Row>
                                                    <Col>
                                                        <Form.Control required
                                                            type="text" 
                                                            name="categoryName" 
                                                            value={weightAgeCategoryInputField.categoryName} 
                                                            onChange={event => this.handleChangeWeightAgeCategoryFields(index, event)}
                                                            style={{marginBottom: "10px"}}
                                                        />
                                                    </Col>                                                    
                                                    <Col className="col-md-auto">
                                                        <Button variant="danger" 
                                                                onClick={() => this.handleRemoveWeightAgeCategoryField(index)}                                                                
                                                        >-</Button>
                                                    </Col>
                                                    <Col className="col-md-auto">
                                                        <Button  
                                                                variant="info" 
                                                                onClick={() => this.handleAddWeightAgeCategoryField(index)} 
                                                        >+</Button>
                                                    </Col>                                        
                                                </Form.Row>
                                            </div>
                                        ) )
                                    }                                    
                                <br />
                                <Card.Footer style={{paddingRight: "0px", paddingBottom: "0px", paddingTop: "1.25rem"}}>
                                    <div className="d-flex flex-row-reverse"> 
                                        <Button variant="info" type="submit">{t("post")}</Button>                            
                                    </div>
                                </Card.Footer>
                            </Form>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            ) : ( 
                <Alert variant="danger">
                    <Alert.Heading>Access denided</Alert.Heading>
                    <p>You have no priviledges granted to view this section.</p>
                </Alert> 
            )
        );
    }
}

export default withTranslation()(AddTournament);