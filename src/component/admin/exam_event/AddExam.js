import React, {Component} from "react";
import {
    Card,
    Form,    
    Col,    
    Button,
    Alert
} from "react-bootstrap";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import Dropzone from "../Dropzone";
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();
const EXAM_EVENTS_API_URL = Urls.WEBSERVICE_URL + "/exam_events";


class AddExam extends Component
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
                fees: [
                    {
                        title: "",
                        amount: ""
                    }
                ],
                examRegistrations: []
            },
            errorMessage: null,
            formValidated: false,
            eventTempPicture: ""          
        }

        this.handleAddEvent = this.handleAddEvent.bind(this);
        this.handleChangeFeeFields = this.handleChangeFeeFields.bind(this);
        this.handleAddFeeField = this.handleAddFeeField.bind(this);
        this.handleRemoveFeeField = this.handleRemoveFeeField.bind(this); 
        
        this.onDropEventPicture = this.onDropEventPicture.bind(this);
    }

    handleAddEvent(e)
    {
        e.preventDefault();
        if ( e.currentTarget.checkValidity() )
        { 
            this.setState({ formValidated: true });

            let examEvent = {...this.state.event, startDate: e.target.startDate.value, endDate: e.target.endDate.value};

            fetch(EXAM_EVENTS_API_URL,{
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + currentUser.accessToken
                },
                body: JSON.stringify( examEvent )                
            })
            .then(response => response.json())
            .then(data => {
                // - - - save main event picture - - - 
                let imageTargetDir = "/images/exams/" + data.id + "/event_picture/";
                let formData = new FormData();
                formData.append("picture", this.state.eventTempPicture.file);
                formData.append("imageTargetDir", imageTargetDir);

                fetch(Urls.EXPRESS_JS_URL + "/save_event_picture", {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + currentUser.accessToken
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(response => {
                    examEvent = {...data, eventPicturePath: this.state.eventTempPicture.name ? imageTargetDir + this.state.eventTempPicture.name : ""}
                    
                    fetch(EXAM_EVENTS_API_URL,{
                        method: "PUT",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + currentUser.accessToken
                        },
                        body: JSON.stringify( examEvent )            
                    })
                    .then(response => {
                        if ( response.ok )
                        {
                            this.props.history.push("/event_wall_component");
                            window.location.reload();    
                        }
                        
                        return response.json();
                    })
                    .then( result => this.setState({ errorMessage: result.message }) );        
                });        
            },
            error => { this.setState({ errorMessage: error.message }) });            
        }
        else this.setState({ 
            formValidated: true,
            errorMessage: this.props.t("fill_all_required_fields")
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

    onDropEventPicture(acceptedFiles)
    {
        this.setState({
            eventTempPicture: {
                file: acceptedFiles[0],
                name: acceptedFiles[0].name
            }
        });
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
                                                <Datetime 
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
                                    <Form.Group>
                                        <Card>
                                            <Dropzone   onDrop={this.onDropEventPicture} 
                                                        accept={"image/*"} 
                                                        imagePath={
                                                            this.state.eventTempPicture ? 
                                                            URL.createObjectURL(this.state.eventTempPicture.file) : ""
                                                        }
                                                        mw="640px"
                                                        mh="480px"
                                            />                                            
                                        </Card>
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

export default withTranslation()(AddExam);