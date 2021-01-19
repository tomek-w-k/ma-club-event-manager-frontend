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
import Dropzone from "../Dropzone";
import AuthService from "../../../service/auth-service";


const currentUser = AuthService.getCurrentUser();

const TOURNAMENT_EVENTS_API_URL = "http://localhost:8081/tournament_events";
const ROOM_TYPES_API_URL = "http://localhost:8081/room_types";
const STAY_PERIODS_API_URL = "http://localhost:8081/stay_periods";
const WEIGHT_AGE_CATEGORIES_API_URL = "http://localhost:8081/weight_age_categories";


class TournamentDetails extends Component
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
                roomTypes: [],
                stayPeriods: [],
                fee: null,
                weightAgeCategories: [],
                tournamentRegistrations: []
            },
            errorMessage: null,
            formValidated: false,
            registrationsCountsForRoomTypes: [],
            registrationsCountsForStayPeriods: [],
            registrationsCountsForWeightAgeCategories: [],
            eventTempPicturePath: ""          
        };
        this.loadTournamentOptions = this.loadTournamentOptions.bind(this);
        this.clearTempImageDirectory = this.clearTempImageDirectory.bind(this);
        this.handleEditEvent = this.handleEditEvent.bind(this);
        this.refreshTournamentDetails = this.refreshTournamentDetails.bind(this);
        
        this.handleChangeRoomTypeFields = this.handleChangeRoomTypeFields.bind(this);
        this.handleAddRoomTypeField = this.handleAddRoomTypeField.bind(this);
        this.handleRemoveRoomTypeField = this.handleRemoveRoomTypeField.bind(this);
        this.hasRoomTypeRegistrations = this.hasRoomTypeRegistrations.bind(this);

        this.handleChangeStayPeriodFields = this.handleChangeStayPeriodFields.bind(this);
        this.handleAddStayPeriodField = this.handleAddStayPeriodField.bind(this);
        this.handleRemoveStayPeriodField = this.handleRemoveStayPeriodField.bind(this);
        this.hasStayPeriodRegistrations = this.hasStayPeriodRegistrations.bind(this);

        this.handleChangeWeightAgeCategoryFields = this.handleChangeWeightAgeCategoryFields.bind(this);
        this.handleAddWeightAgeCategoryField = this.handleAddWeightAgeCategoryField.bind(this);
        this.handleRemoveWeightAgeCategoryField = this.handleRemoveWeightAgeCategoryField.bind(this);
        this.hasWeightAgeCategoryRegistrations = this.hasWeightAgeCategoryRegistrations.bind(this);

        this.disableAccommodationCheckbox = this.disableAccommodationCheckbox.bind(this);

        this.onDrop = this.onDrop.bind(this);
    }

    loadTournamentOptions()
    {
        let allCounts = [];

        const CountsNames = Object.freeze ({
            ROOM_TYPES: 0,
            STAY_PERIODS: 1,
            WEIGHT_AGE_CATEGORIES: 2
        });

        fetch(TOURNAMENT_EVENTS_API_URL + "/" + this.props.id)
        .then(response => response.json())        
        .then(data => {                
            let roomTypeUrls = data.roomTypes.map(roomType => ROOM_TYPES_API_URL + "/" + roomType.id + "/tournament_registrations" );
            let stayPeriodUrls = data.stayPeriods.map(stayPeriod => STAY_PERIODS_API_URL + "/" + stayPeriod.id + "/tournament_registrations");
            let weightAgeCategoryUrls = data.weightAgeCategories.map(weightAgeCategory => WEIGHT_AGE_CATEGORIES_API_URL + "/" + weightAgeCategory.id + "/tournament_registrations");
            
            let roomTypeRequests = roomTypeUrls.map(url => fetch(url));
            let stayPeriodRequests = stayPeriodUrls.map(url => fetch(url));
            let weightAgeCategoryRequests = weightAgeCategoryUrls.map(url => fetch(url));

            let rtCount = Promise.all(roomTypeRequests)
            .then( responses => {
                let jsonResponses = responses.map(response => response.json());                
                return Promise.all(jsonResponses).then(data => data);
            })
            .then(counts => counts.map(count => count.roomTypeCount));             
            allCounts.push(rtCount);

            let spCount = Promise.all(stayPeriodRequests)
            .then( responses => {
                let jsonResponses = responses.map(response => response.json());
                return Promise.all(jsonResponses).then(data => data);
            })
            .then(counts => counts.map(count => count.stayPeriodCount));            
            allCounts.push(spCount);

            let wacCount = Promise.all(weightAgeCategoryRequests)
            .then( responses => {
                let jsonResponses = responses.map(response => response.json());
                return Promise.all(jsonResponses).then(data => data);
            })
            .then(counts => counts.map(count => count.weightAgeCategoryCount));            
            allCounts.push(wacCount);
            
            Promise.all(allCounts)
            .then(allCounts => { return Object.assign({}, allCounts) })
            .then(allCounts => {                
                this.setState({                
                    event: data,
                    registrationsCountsForRoomTypes: allCounts[CountsNames.ROOM_TYPES],
                    registrationsCountsForStayPeriods: allCounts[CountsNames.STAY_PERIODS],
                    registrationsCountsForWeightAgeCategories: allCounts[CountsNames.WEIGHT_AGE_CATEGORIES]
                });
            });
        });        
    }

    clearTempImageDirectory()
    {
        let formData = new FormData();
        formData.append("userTempDir", "/images/temp/" + currentUser.customSessionId);

        fetch("http://localhost:4000/clear_temp_dir", {
            method: "DELETE",
            body: formData
        })
        .then(result => {
            if(result.ok)
                this.setState({ eventTempPicturePath: "" });
        });
    }

    componentDidMount()
    {
        this.loadTournamentOptions();

        window.addEventListener("beforeunload", event => {
            //event.preventDefault();            
            this.clearTempImageDirectory();            
        });
    }

    componentWillUnmount()
    {
        this.clearTempImageDirectory();
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

            fetch(TOURNAMENT_EVENTS_API_URL + "/" + this.props.id + "/tournament_registrations")
            .then(response => response.json())
            .then(data => {                            
                let imageName = "";
                if(this.state.eventTempPicturePath != "")
                    imageName = this.state.eventTempPicturePath.split('\\').pop().split('/').pop();
                else
                    imageName = this.state.event.eventPicturePath.split('\\').pop().split('/').pop();

                let imageTempDir = "";
                if(this.state.eventTempPicturePath != "")
                    imageTempDir = this.state.eventTempPicturePath.replace(imageName, "");
                
                let imageTargetDir = "/images/tournaments/" + this.state.event.id + "/event_picture/";

                let formData = new FormData();
                formData.append("imageName", imageName);
                formData.append("imageTempDir", imageTempDir);
                formData.append("imageTargetDir", imageTargetDir);

                fetch("http://localhost:4000/save_picture", {
                    method: "POST",
                    body: formData
                })
                .then(response => response.json())
                .then(response => {                    
                    this.setState(state => (
                        { event: {...state.event, eventPicturePath: response.imageUrl, tournamentRegistrations: data} }
                    ),
                    () => {
                        fetch(TOURNAMENT_EVENTS_API_URL, {
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
                            this.props.onTournamentUpdate();
                        },
                        error => {
                            error.json()
                            .then(text => {                            
                                this.setState({ errorMessage: text.message })
                            })
                        }); 
                    });
                    return response;
                })
                .then(response => {
                    this.clearTempImageDirectory();
                    return response;
                })
                .catch(error => {
                    console.log("er :: ", error);
                });
            });
        }
        else this.setState({ 
            formValidated: true,
            errorMessage: "Please fill all required fields."
        });
    }

    refreshTournamentDetails()
    {
        this.loadTournamentOptions();
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

        const rtRegCounts = [...this.state.registrationsCountsForRoomTypes];
        rtRegCounts.splice(index+1, 0, null);

        this.setState({ 
            event: {...this.state.event, roomTypes: roomTypeFields},
            registrationsCountsForRoomTypes: rtRegCounts
        });        
    }

    handleRemoveRoomTypeField(index)
    {
        if ( this.state.event.roomTypes.length > 1 )
        {
            const roomTypeFields = [...this.state.event.roomTypes];
            roomTypeFields.splice(index, 1);

            const rtRegCounts = [...this.state.registrationsCountsForRoomTypes];
            rtRegCounts.splice(index, 1);

            this.setState({ 
                event: {...this.state.event, roomTypes: roomTypeFields},
                registrationsCountsForRoomTypes: rtRegCounts
            });            
        }
    }

    hasRoomTypeRegistrations(index)
    { 
        let regCount = this.state.registrationsCountsForRoomTypes[index];
        
        if ( regCount !== null && regCount != 0 && regCount !== undefined )
            return true;
        else return false;
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

        const spRegCounts = [...this.state.registrationsCountsForStayPeriods];
        spRegCounts.splice(index+1, 0, null);

        this.setState({ 
            event: {...this.state.event, stayPeriods: stayPeriodFields},
            registrationsCountsForStayPeriods: spRegCounts
        });       
    }

    handleRemoveStayPeriodField(index)
    {
        if ( this.state.event.stayPeriods.length > 1 )
        {
            const stayPeriodFields = [...this.state.event.stayPeriods];
            stayPeriodFields.splice(index, 1);

            const spRegCounts = [...this.state.registrationsCountsForStayPeriods];
            spRegCounts.splice(index, 1);

            this.setState({ 
                event: {...this.state.event, stayPeriods: stayPeriodFields},
                registrationsCountsForStayPeriods: spRegCounts
            });            
        }
    }

    hasStayPeriodRegistrations(index)
    {
        let regCount = this.state.registrationsCountsForStayPeriods[index];
        
        if ( regCount !== null && regCount != 0 && regCount !== undefined )
            return true;        
        else return false;           
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

        const wacRegCounts = [...this.state.registrationsCountsForWeightAgeCategories];
        wacRegCounts.splice(index+1, 0, null);

        this.setState({ 
            event: {...this.state.event, weightAgeCategories: weightAgeCategoryFields},
            registrationsCountsForWeightAgeCategories: wacRegCounts
        });       
    }

    handleRemoveWeightAgeCategoryField(index)
    {
        if ( this.state.event.weightAgeCategories.length > 1 )
        {
            const weightAgeCategoryFields = [...this.state.event.weightAgeCategories];
            weightAgeCategoryFields.splice(index, 1);

            const wacRegCounts = [...this.state.registrationsCountsForWeightAgeCategories];
            wacRegCounts.splice(index, 1);

            this.setState({ 
                event: {...this.state.event, weightAgeCategories: weightAgeCategoryFields},
                registrationsCountsForWeightAgeCategories: wacRegCounts
            });            
        }
    }

    hasWeightAgeCategoryRegistrations(index)
    {
        let regCount = this.state.registrationsCountsForWeightAgeCategories[index];
        
        if ( regCount !== null && regCount != 0 )
            return true;
        else return false;
    }

    disableAccommodationCheckbox()
    {        
        let disableAccommodationCheckbox = false;
        
        this.state.registrationsCountsForRoomTypes.forEach((regCount) => {            
            if ( regCount !== null && regCount != 0 ) 
                disableAccommodationCheckbox = true;
        });
        
        this.state.registrationsCountsForStayPeriods.forEach((regCount) => {            
            if ( regCount !== null && regCount != 0 )
                disableAccommodationCheckbox = true;
        });

        return disableAccommodationCheckbox;
    }

    onDrop(acceptedFiles)
    {
        let imageDir = "/images/temp/" + currentUser.customSessionId + "/tournament_details/";

        let formData = new FormData();
        formData.append("picture" , acceptedFiles[0]);
        formData.append("imageDir", imageDir);

        fetch("http://localhost:4000/save_temp_picture", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(response => {
            this.setState(state => ({ 
                event: {...state.event, eventPicturePath: response.imageUrl},
                eventTempPicturePath: response.imageUrl
            }));            
        });
    }

    render()
    {                
        const roomTypes = [...this.state.event.roomTypes];

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



                                    <Form.Group>
                                        <Card>
                                            <Dropzone onDrop={this.onDrop} accept={"image/*"} imagePath={this.state.event.eventPicturePath}  />                                            
                                        </Card>
                                    </Form.Group>



                                    <Form.Group>
                                        <Form.Control                                             
                                            type="text"
                                            name="eventPicturePath"
                                            value={this.state.event.eventPicturePath}
                                            onChange={(e) => { this.setState({ event: {...this.state.event, eventPicturePath: e.target.value} }) }}
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
                                    <Form.Group >
                                        <Row>
                                            <Form.Label column sm="2">Accommodation</Form.Label>
                                            <Form.Check 
                                                type="checkbox"
                                                name="accommodation"
                                                style={{display: "flex", alignItems: "center"}}
                                                checked={this.state.event.accommodation}
                                                disabled={this.disableAccommodationCheckbox()}
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
                                                <Col><Form.Label>Room types</Form.Label></Col>
                                            </Form.Row>
                                            {   
                                                roomTypes.map( (roomTypeInputField, index) => (
                                                    <div key={index}>
                                                        <Form.Row>
                                                            <Col>
                                                                <Form.Control required
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
                                                                        disabled={this.hasRoomTypeRegistrations(index)}
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
                                                <Col><Form.Label>Stay periods</Form.Label></Col>
                                            </Form.Row>
                                            {
                                                this.state.event.stayPeriods.map( (stayPeriodInputField, index) => (
                                                    <div key={index}>
                                                        <Form.Row>
                                                            <Col>
                                                                <Form.Control required
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
                                                                        disabled={this.hasStayPeriodRegistrations(index)}
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
                                        <Col><Form.Label>Weight / age categories</Form.Label></Col>
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
                                                                disabled={this.hasWeightAgeCategoryRegistrations(index)}
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

export default TournamentDetails;