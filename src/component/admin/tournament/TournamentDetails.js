import React, {Component} from "react";
import {
    Card,
    Form,
    Row,
    Col,    
    Button,
    Alert
} from "react-bootstrap";
import Datetime from "react-datetime";
import Dropzone from "../Dropzone";
import AuthService from "../../../service/auth-service";
import { withTranslation } from "react-i18next";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();

const TOURNAMENT_EVENTS_API_URL = Urls.WEBSERVICE_URL + "/tournament_events";
const ROOM_TYPES_API_URL = Urls.WEBSERVICE_URL + "/room_types";
const STAY_PERIODS_API_URL = Urls.WEBSERVICE_URL + "/stay_periods";
const WEIGHT_AGE_CATEGORIES_API_URL = Urls.WEBSERVICE_URL + "/weight_age_categories";


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
            eventTempPicture: "",
            rtTempPictures: []         
        };
        this.loadTournamentOptions = this.loadTournamentOptions.bind(this);        
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

        this.onDropEventPicture = this.onDropEventPicture.bind(this);
        this.handleRemoveRoomTypePicture = this.handleRemoveRoomTypePicture.bind(this);

    }

    loadTournamentOptions()
    {
        let allCounts = [];

        const CountsNames = Object.freeze ({
            ROOM_TYPES: 0,
            STAY_PERIODS: 1,
            WEIGHT_AGE_CATEGORIES: 2
        });

        fetch(TOURNAMENT_EVENTS_API_URL + "/" + this.props.id, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        })
        .then(response => response.json())        
        .then(data => {                
            let roomTypeUrls = data.roomTypes.map(roomType => ROOM_TYPES_API_URL + "/" + roomType.id + "/tournament_registrations" );
            let stayPeriodUrls = data.stayPeriods.map(stayPeriod => STAY_PERIODS_API_URL + "/" + stayPeriod.id + "/tournament_registrations");
            let weightAgeCategoryUrls = data.weightAgeCategories.map(weightAgeCategory => WEIGHT_AGE_CATEGORIES_API_URL + "/" + weightAgeCategory.id + "/tournament_registrations");
            
            let roomTypeRequests = roomTypeUrls.map(url => fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + currentUser.accessToken
                }
            }));
            let stayPeriodRequests = stayPeriodUrls.map(url => fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + currentUser.accessToken
                }
            }));
            let weightAgeCategoryRequests = weightAgeCategoryUrls.map(url => fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + currentUser.accessToken
                }
            }));

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
            
            // - - - Get pictures for Room Types - - - 
            let rtTempPicturesRequests = data.roomTypes.map(rt => {                
                let imageName = rt.roomTypePicturePath ? rt.roomTypePicturePath.split('\\').pop().split('/').pop() : "";                 
                let url = Urls.EXPRESS_JS_URL + "/get_rt_picture/" + data.id + "/" + imageName;                
                return fetch(url, {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + currentUser.accessToken
                    }
                });
            });

            Promise.all(rtTempPicturesRequests)
            .then(responses => responses.map(response => response.blob()))
            .then(blobPromises => {
                Promise.all(blobPromises)
                .then(blobs => {
                    return blobs.map((blob, index) => {
                        let fileName = data.roomTypes[index].roomTypePicturePath ? data.roomTypes[index].roomTypePicturePath.split('\\').pop().split('/').pop() : "";
                        let file = new File([blob], fileName, {type:"image/jpeg", lastModified:new Date()});                        
                        return {
                            file: file,
                            name: fileName
                        };
                    });                    
                })
                .then(fileWithNameObjects => {                    
                    this.setState({ rtTempPictures: fileWithNameObjects });
                });
            });

            // - - - Get event picture - - - 
            let eventPictureName = data.eventPicturePath ? data.eventPicturePath.split('\\').pop().split('/').pop() : "";
            let getTournamentPictureUrl = Urls.EXPRESS_JS_URL + "/get_tournament_picture/" + data.id + "/" + eventPictureName;

            fetch(getTournamentPictureUrl, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + currentUser.accessToken
                }
            })
            .then(response => response.blob())
            .then(blob => {
                let fileName = data.eventPicturePath ? data.eventPicturePath.split('\\').pop().split('/').pop() : "";
                let file = new File([blob], fileName, {type:"image/jpeg", lastModified:new Date()});
                return {
                    file: file,
                    name: fileName
                };
            })
            .then(fileWithNameObject => {
                this.setState({ eventTempPicture: fileWithNameObject });
            });
            
            // - - - Set loaded tournament in state - - -
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

    componentDidMount()
    {
        this.loadTournamentOptions();

        // window.addEventListener("beforeunload", event => {
        //     //event.preventDefault();            
        //     this.clearTempImageDirectory();            
        // });
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
            let tournamentEvent = {...this.state.event};

            fetch(TOURNAMENT_EVENTS_API_URL + "/" + this.props.id + "/tournament_registrations", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + currentUser.accessToken
                }
            })
            .then(response => response.json())
            .then(data => {
                tournamentEvent = {...tournamentEvent, tournamentRegistrations: data};

                // - - - save pictures of room types - - - 
                let rtImagesDir = "/images/tournaments/" + tournamentEvent.id + "/room_types_pictures/"; 

                let formData = new FormData();
                formData.append("imageTargetDir", rtImagesDir);
                fetch(Urls.EXPRESS_JS_URL + "/clear_rt_dir", {
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + currentUser.accessToken
                    },
                    body: formData
                })
                .then(() => {
                    let rtPicturesRequests = tournamentEvent.roomTypes.map((roomType, index) => {
                        let formData = new FormData();
                        formData.append("picture", this.state.rtTempPictures[index].file);                    
                        formData.append("imageTargetDir", rtImagesDir);
                        
                        return fetch(Urls.EXPRESS_JS_URL + "/save_rt_picture", {
                            method: "POST",
                            headers: {
                                "Authorization": "Bearer " + currentUser.accessToken
                            },
                            body: formData
                        });
                    });

                    Promise.all(rtPicturesRequests)
                    .then(() => {                                                                        
                        return tournamentEvent.roomTypes.map((roomType, index) => {
                            return {...roomType, roomTypePicturePath: this.state.rtTempPictures[index].name ? rtImagesDir + this.state.rtTempPictures[index].name : ""}
                        });  
                    })
                    .then(roomTypes => {
                        tournamentEvent = {...tournamentEvent, roomTypes: roomTypes};

                        // - - - save main event picture - - - 
                        let imageTargetDir = "/images/tournaments/" + tournamentEvent.id + "/event_picture/";
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
                            tournamentEvent = {...tournamentEvent, eventPicturePath: this.state.eventTempPicture.name ? imageTargetDir + this.state.eventTempPicture.name : "" }

                            // - - - save tournament - - -                             
                            fetch(TOURNAMENT_EVENTS_API_URL, {
                                method: "PUT",
                                headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer " + currentUser.accessToken
                                },
                                body: JSON.stringify( {...tournamentEvent, startDate: e.target.startDate.value, endDate: e.target.endDate.value} )            
                            })                                      
                            .then(result => {
                                return new Promise((resolve, reject) => {
                                    if(result.ok)
                                        resolve();                            
                                    else reject(result);
                                })
                            },
                            error => { this.setState({ errorMessage: "Error: Event not updated." }) })
                            .then( msg => { this.props.onTournamentUpdate() },
                            error => { error.json().then(text => { this.setState({ errorMessage: text.message }) }) });                    
                            return response;
                        });                        
                    });                  
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

        const rtTempPictures = [...this.state.rtTempPictures];
        rtTempPictures.splice(index+1, 0, "");

        this.setState({ 
            event: {...this.state.event, roomTypes: roomTypeFields},
            registrationsCountsForRoomTypes: rtRegCounts,
            rtTempPictures: rtTempPictures
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

            const rtTempPictures = [...this.state.rtTempPictures];
            rtTempPictures.splice(index, 1);

            this.setState({ 
                event: {...this.state.event, roomTypes: roomTypeFields},
                registrationsCountsForRoomTypes: rtRegCounts,
                rtTempPictures: rtTempPictures
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

    onDropEventPicture(acceptedFiles)
    {
        this.setState({
            eventTempPicture: {
                file: acceptedFiles[0],
                name: acceptedFiles[0].name
            }
        });
    }

    onDropRoomTypePicture(index, acceptedFiles)
    {   
        let rtTempPictures = [...this.state.rtTempPictures];             
        rtTempPictures[index] = {
            file: acceptedFiles[0],
            name: acceptedFiles[0].name
        };

        this.setState({ rtTempPictures: rtTempPictures });
    }

    handleRemoveRoomTypePicture(index)
    {
        let rtTempPictures = [...this.state.rtTempPictures];
        let roomTypes = [...this.state.event.roomTypes];
        
        rtTempPictures[index] = "";
        roomTypes[index].roomTypePicturePath = "";

        this.setState(state => ({ 
            event: {...state.event, roomTypes: roomTypes},
            rtTempPictures: rtTempPictures
        }));
    }

    render()
    {                
        const roomTypes = [...this.state.event.roomTypes];        
        const rtImageSize = "300px";   
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
                                                    onChange={(date) => { this.setState({ event: {...this.state.event, startDate: date} }) }}                                         
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
                                                    onChange={(date) => { this.setState({ event: {...this.state.event, endDate: date} }) }}           
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
                                                disabled={this.disableAccommodationCheckbox()}
                                                onChange={(e) => { 
                                                    if ( e.target.checked )
                                                        this.setState({ 
                                                            event: {...this.state.event, 
                                                                accommodation: e.target.checked,
                                                                roomTypes: [{ roomTypeName: "", roomTypePicturePath: "" }],
                                                                stayPeriods: [{ stayPeriodName: "" }]
                                                            } 
                                                        });     
                                                    else 
                                                        this.setState({ 
                                                            event: {...this.state.event, 
                                                                accommodation: e.target.checked,
                                                                roomTypes: [],
                                                                stayPeriods: []
                                                            },
                                                            rtTempPictures: [] 
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
                                                roomTypes.map( (roomTypeInputField, index) => (
                                                    <div key={index}>
                                                        <Form.Row>
                                                            <Col className="col-md-auto col">
                                                                <Form.Group >
                                                                    <Card >
                                                                        <Dropzone   onDrop={this.onDropRoomTypePicture.bind(this, index)} 
                                                                                    accept={"image/*"} 
                                                                                    imagePath={
                                                                                        this.state.rtTempPictures[index] ? 
                                                                                        URL.createObjectURL(this.state.rtTempPictures[index].file) : ""
                                                                                    }
                                                                                    mw={rtImageSize}
                                                                                    mh={rtImageSize}
                                                                        />
                                                                    </Card>
                                                                </Form.Group>
                                                            </Col>
                                                            <Col>
                                                                <Form.Control required
                                                                    //type="text" 
                                                                    as="textarea"
                                                                    name="roomTypeName" 
                                                                    value={roomTypeInputField.roomTypeName} 
                                                                    onChange={event => this.handleChangeRoomTypeFields(index, event)}
                                                                    style={{marginBottom: "10px"}}
                                                                />
                                                                <Form.Control                                             
                                                                    type="text"
                                                                    name="roomTypePicturePath"
                                                                    value={roomTypeInputField.roomTypePicturePath}
                                                                    onChange={event => this.handleChangeRoomTypeFields(index, event)}
                                                                />
                                                                <Button variant="danger" 
                                                                        onClick={() => this.handleRemoveRoomTypePicture(index)}                                                                        
                                                                >Remove image</Button>
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
                                                <Col><Form.Label>{t("stay_periods")}</Form.Label></Col>
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

export default withTranslation('translation', { withRef: true })(TournamentDetails);