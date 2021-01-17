import React, {Component} from "react";
import {
    Card,
    Form,
    Row,
    Col,    
    Button,    
    Accordion,
    Alert
} from "react-bootstrap";
import Datetime from "react-datetime";

import AuthService from "../../../service/auth-service";


const CAMP_EVENTS_API_URL = "http://localhost:8081/camp_events";
const CLOTHING_SIZES_API_URL = "http://localhost:8081/clothing_sizes";


class CampDetailsComponent extends Component
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
                clothingType: "",
                clothingSizes: [],
                fees: [],
                campRegistrations: []
            },
            errorMessage: null,
            formValidated: false,
            registrationsCountsForClothingTypes: []           
        };
        this.loadCampOptions = this.loadCampOptions.bind(this);
        this.handleEditEvent = this.handleEditEvent.bind(this);
        
        this.handleChangeFeeFields = this.handleChangeFeeFields.bind(this);        
        this.handleAddFeeField = this.handleAddFeeField.bind(this);
        this.handleRemoveFeeField = this.handleRemoveFeeField.bind(this);

        this.handleChangeClothingSizeFields = this.handleChangeClothingSizeFields.bind(this);
        this.handleAddClothingSizeField = this.handleAddClothingSizeField.bind(this);
        this.handleRemoveClothingSizeField = this.handleRemoveClothingSizeField.bind(this);
        this.hasClothingSizeRegistrations = this.hasClothingSizeRegistrations.bind(this);
    }

    loadCampOptions()
    {        
        fetch(CAMP_EVENTS_API_URL + "/" + this.props.id)
        .then(response => response.json())
        .then(data => {
            let clothingSizeUrls = data.clothingSizes.map(clothingSize => CLOTHING_SIZES_API_URL + "/" + clothingSize.id + "/camp_registrations");
            let clothingSizeRequests = clothingSizeUrls.map(url => fetch(url));

            Promise.all(clothingSizeRequests)
            .then( responses => {                
                let jsonResponses = responses.map(response => response.json());
                return Promise.all(jsonResponses).then(data => data);
            })
            .then(counts => counts.map(count => count.clothingSizeCount))
            .then(counts => {
                this.setState({
                    event: data,
                    registrationsCountsForClothingTypes: counts
                });                
            });            
        });        
    }

    componentDidMount()
    {
        this.loadCampOptions();
    }

    /*
        Event registrations could be updated meanwhile in the table below, so first it is necessary to load registrations from the database,
        write them into the current event object and then send the current object with PUT method. 
    */    
    handleEditEvent(e)
    {
        e.preventDefault(); 
        if ( e.currentTarget.checkValidity() )
        {
            this.setState({ formValidated: true });

            fetch(CAMP_EVENTS_API_URL + "/" + this.props.id + "/camp_registrations")
            .then(response => response.json())
            .then(data => {            
                this.setState(state => (
                    { event: {...state.event, campRegistrations: data} }
                ),
                () => {
                    fetch(CAMP_EVENTS_API_URL, {
                        method: "PUT",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify( {...this.state.event, startDate: e.target.startDate.value, endDate: e.target.endDate.value} )            
                    })                    
                    .then(result => {
                        return new Promise((resolve, reject) => {
                            if(result.ok)
                                resolve();                            
                            else reject(result);
                        })
                    },
                    error => { this.setState({ errorMessage: "Error: Event not updated." }) })
                    .then( msg => {
                        this.props.onCampUpdate();
                    },
                    error => {
                        error.json()
                        .then(text => {                            
                            this.setState({ errorMessage: text.message })
                        })
                    });
                });
            });
        }
        else this.setState({ 
            formValidated: true,
            errorMessage: "Please fill all required fields."
        });
    }

    handleChangeFeeFields(index, event)
    {
        const values = this.state.event.fees;
        values[index][event.target.name] = event.target.value;
        this.setState({ event: {...this.state.event, fees: values} });        
    }

    handleAddFeeField(index)
    {         
        const feeFields = [...this.state.event.fees];
        feeFields.splice(index+1, 0, { title: "", amount: "" });
        this.setState({ event: {...this.state.event, fees: feeFields} });        
    }

    handleRemoveFeeField(index)
    {
        if ( this.state.event.fees.length > 1 )
        {
            const feeFields = [...this.state.event.fees];
            feeFields.splice(index, 1);
            this.setState({ event: {...this.state.event, fees: feeFields} });            
        }
    }

    handleChangeClothingSizeFields(index, event)
    {
        const values = this.state.event.clothingSizes;
        values[index][event.target.name] = event.target.value;
        this.setState({ event: {...this.state.event, clothingSizes: values} });        
    }

    handleAddClothingSizeField(index)
    {         
        const clothingSizeFields = [...this.state.event.clothingSizes];
        clothingSizeFields.splice(index+1, 0, { clothingSizeName: "" });
        this.setState({ event: {...this.state.event, clothingSizes: clothingSizeFields} });       
    }

    handleRemoveClothingSizeField(index)
    {
        if ( this.state.event.clothingSizes.length > 1 )
        {
            const clothingSizeFields = [...this.state.event.clothingSizes];
            clothingSizeFields.splice(index, 1);
            this.setState({ event: {...this.state.event, clothingSizes: clothingSizeFields} });            
        }
    }

    hasClothingSizeRegistrations(index)
    {
        let regCount = this.state.registrationsCountsForClothingTypes[index];
        
        if ( regCount !== null && regCount != 0 )
            return true;
        else return false;
    }

    render()
    {
        const currentUser = AuthService.getCurrentUser();        

        return( 
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            ( 
                <div>
                    {this.state.errorMessage && (<Alert variant="danger">{this.state.errorMessage}</Alert>)}
                    <Accordion defaultActiveKey="0">
                    <Card >
                        {/* style={{backgroundColor: "#EAECEE"}} */}
                        <Card.Header>
                            <div className="d-flex">
                                <div style={{display: "flex", alignItems: "center"}}>DETAILS</div>
                                <Accordion.Toggle className="ml-auto" as={Button} variant="secondary" eventKey="0">Show / Hide</Accordion.Toggle>
                            </div>                        
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <Card.Text>
                            <Form noValidate validated={this.state.formValidated} onSubmit={this.handleEditEvent}>   
                                    <Form.Group>
                                        <Form.Label>Name</Form.Label>
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
                                                <Form.Label>From</Form.Label>
                                                <Datetime 
                                                    inputProps={{name: "startDate", autoComplete: "off", required: "true" }}
                                                    value={this.state.event.startDate}
                                                    onChange={(date) => { this.setState({ event: {...this.state.event, startDate: date} }) }}                                         
                                                    dateFormat="DD-MM-YYYY"
                                                    timeFormat="HH:mm:ss"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>To</Form.Label>
                                                <Datetime 
                                                    inputProps={{ name: "endDate", autoComplete: "off", required: "true" }}
                                                    value={this.state.event.endDate}
                                                    onChange={(date) => { this.setState({ event: {...this.state.event, endDate: date} }) }}           
                                                    dateFormat="DD-MM-YYYY"
                                                    timeFormat="HH:mm:ss"
                                                />
                                            </Form.Group>
                                        </Col>                            
                                    </Form.Row>
                                    <Form.Group>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control 
                                            as="textarea"
                                            name="eventDescription"
                                            value={this.state.event.eventDescription}
                                            onChange={(e) => { this.setState({ event: {...this.state.event, eventDescription: e.target.value} }) }}
                                        />
                                    </Form.Group>
                                    <Form.Group >
                                            <Row>
                                            <Form.Label column sm="2">Sayonara meeting</Form.Label>
                                            <Form.Check 
                                                type="checkbox"
                                                name="sayonaraMeeting"
                                                style={{display: "flex", alignItems: "center"}}
                                                checked={this.state.event.sayonaraMeeting}
                                                onChange={(e) => { this.setState({ event: {...this.state.event, sayonaraMeeting: e.target.checked} }) }}
                                            />
                                            </Row>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Clothing type</Form.Label>
                                            <Form.Control required
                                                type="text"
                                                name="clothingType"
                                                value={this.state.event.clothingType}
                                                onChange={(e) => { this.setState({ event: {...this.state.event, clothingType: e.target.value} }) }}                            
                                            />
                                        </Form.Group> 
                                    <Form.Row>
                                        <Col><Form.Label>Clothing sizes</Form.Label></Col>
                                    </Form.Row>
                                    {
                                        this.state.event.clothingSizes.map( (clothingSizeInputField, index) => (
                                            <div key={index}>
                                                <Form.Row>
                                                    <Col>
                                                        <Form.Control required
                                                            type="text" 
                                                            name="clothingSizeName" 
                                                            value={clothingSizeInputField.clothingSizeName} 
                                                            onChange={event => this.handleChangeClothingSizeFields(index, event)}
                                                            style={{marginBottom: "10px"}}
                                                        />
                                                    </Col>                                                
                                                    <Col className="col-md-auto">
                                                        <Button variant="danger" 
                                                                onClick={() => this.handleRemoveClothingSizeField(index)}
                                                                disabled={this.hasClothingSizeRegistrations(index)}
                                                        >-</Button>
                                                    </Col>
                                                    <Col className="col-md-auto">
                                                        <Button  
                                                                variant="info" 
                                                                onClick={() => this.handleAddClothingSizeField(index)} 
                                                        >+</Button>
                                                    </Col>                                        
                                                </Form.Row>
                                            </div>
                                        ) )
                                    }
                                    <br />
                                    <Form.Row>
                                        <Col><Form.Label>Fees</Form.Label></Col>
                                    </Form.Row>
                                    {
                                        this.state.event.fees.map( (feeInputField, index) => (
                                            <div key={index}>
                                                <Form.Row>
                                                    <Col>
                                                        <Form.Control required
                                                            type="text" 
                                                            name="title" 
                                                            value={feeInputField.title} 
                                                            onChange={event => this.handleChangeFeeFields(index, event)}
                                                            style={{marginBottom: "10px"}}
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Form.Control required
                                                            type="number" 
                                                            step="0.01" 
                                                            name="amount" 
                                                            value={feeInputField.amount}
                                                            onChange={event => this.handleChangeFeeFields(index, event)} 
                                                            style={{marginBottom: "10px"}}
                                                        />
                                                    </Col>
                                                    <Col className="col-md-auto">
                                                        <Button variant="danger" 
                                                                onClick={() => this.handleRemoveFeeField(index)}
                                                        >-</Button>
                                                    </Col>
                                                    <Col className="col-md-auto">
                                                        <Button  
                                                                variant="info" 
                                                                onClick={() => this.handleAddFeeField(index)} 
                                                        >+</Button>
                                                    </Col>                                        
                                                </Form.Row>
                                            </div>
                                        ) )
                                    }
                                <br />
                                <Card.Footer style={{paddingRight: "0px", paddingBottom: "0px", paddingTop: "1.25rem"}}>
                                    <div className="d-flex flex-row-reverse">  
                                        <Button variant="info" type="submit">Post</Button>                            
                                    </div>
                                </Card.Footer>
                            </Form>
                            </Card.Text>
                        </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    </Accordion>
                </div>
            ) :
            ( <h2>You do not have priviledges  granted to view this section.</h2> )
        );
    }
}

export default CampDetailsComponent;