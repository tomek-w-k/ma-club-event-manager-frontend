import React, {Component} from "react";
import {
    Card,
    Form,
    Col,    
    Button, 
    Alert
} from "react-bootstrap";
import Datetime from "react-datetime";
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();
const EXAM_EVENTS_API_URL = Urls.WEBSERVICE_URL + "/exam_events";


class ExamDetails extends Component
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
                fees: [],
                examRegistrations: []
            },
            errorMessage: null,
            formValidated: false            
        }

        this.handleEditEvent = this.handleEditEvent.bind(this);
        this.handleChangeFeeFields = this.handleChangeFeeFields.bind(this);
        this.handleAddFeeField = this.handleAddFeeField.bind(this);
        this.handleRemoveFeeField = this.handleRemoveFeeField.bind(this);
        this.handleChangeFromDateTime = this.handleChangeFromDateTime.bind(this);
        this.handleChangeToDateTime = this.handleChangeToDateTime.bind(this);
    }

    componentDidMount()
    {        
        fetch(EXAM_EVENTS_API_URL + "/" + this.props.id, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        })
        .then(response => response.json())
        .then(data => { this.setState({ event: data }) });
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

            fetch(EXAM_EVENTS_API_URL + "/" + this.props.id + "/exam_registrations", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + currentUser.accessToken
                }
            })
            .then(response => response.json())
            .then(data => {
                this.setState(state => ({
                    event: {...state.event, examRegistrations: data}
                }),
                () => {
                    fetch(EXAM_EVENTS_API_URL, {
                        method: "PUT",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + currentUser.accessToken
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
                        this.props.onExamUpdate();
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
    
    handleChangeFromDateTime(date) 
    {
        this.setState({ event: {...this.state.event, startDate: date} });       
    }

    handleChangeToDateTime(date)
    {
        this.setState({ event: {...this.state.event, endDate: date} });        
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

    render()
    {
        const t = this.props.t;
        
        return(             
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (                 
                <div>
                    {this.state.errorMessage && (<Alert variant="danger">{this.state.errorMessage}</Alert>)}                   
                    <Card >                        
                        <Card.Body>
                            <Card.Text>
                            <Form noValidate validated={this.state.formValidated} onSubmit={this.handleEditEvent}>                    
                                
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
                                                    inputProps={{name: "startDate", autoComplete: "off", required: "true" }}
                                                    value={this.state.event.startDate}
                                                    onChange={this.handleChangeFromDateTime}                                         
                                                    dateFormat="DD-MM-YYYY"
                                                    timeFormat="HH:mm:ss"
                                                                                                    
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>{t("to")}</Form.Label>
                                                <Datetime 
                                                    inputProps={{ name: "endDate", autoComplete: "off", required: "true" }}
                                                    value={this.state.event.endDate}
                                                    onChange={this.handleChangeToDateTime}           
                                                    dateFormat="DD-MM-YYYY"
                                                    timeFormat="HH:mm:ss"
                                                />
                                            </Form.Group>
                                        </Col>                            
                                    </Form.Row>
                                    <Form.Group>
                                        <Form.Label>{t("description")}</Form.Label>
                                        <Form.Control 
                                            rows="6"
                                            as="textarea"
                                            name="eventDescription"
                                            value={this.state.event.eventDescription}
                                            onChange={(e) => { this.setState({ event: {...this.state.event, eventDescription: e.target.value} }) }}
                                        />
                                    </Form.Group>                                    
                                    <Form.Row>
                                        <Col><Form.Label>{t("fees")}</Form.Label></Col>
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
                                        <Button variant="info" type="submit" disabled>{t("post")}</Button>                            
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

export default withTranslation()(ExamDetails);