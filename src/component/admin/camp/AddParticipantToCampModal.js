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
import CrudTableComponent from "../../CrudTableComponent";
import { textFilter } from 'react-bootstrap-table2-filter';
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();
const CAMP_REGISTRATION_API_URL = Urls.WEBSERVICE_URL + "/camp_registrations";
const USERS_API_URL = Urls.WEBSERVICE_URL + "/users";
const CAMP_EVENTS = Urls.WEBSERVICE_URL + "/camp_events"; 
const CAMP_REGISTRATIONS = Urls.WEBSERVICE_URL + "/camp_registrations"; 

const Columns = Object.freeze ({
    ID: 0,
    FULL_NAME: 1,
    COUNTRY: 2,
    CLUB: 3,    
});

const headerFormatter = (column, colIndex, { sortElement, filterElement }) => {
    return (
        <div style={ { display: 'flex', flexDirection: 'column' } }>            
            { column.text }            
            { filterElement }
            { sortElement }
        </div>
    );
};

const columns = [
    {
        dataField: "id",
        sort: false,
        hidden: true
    },
    {
        dataField: "fullName",
        text: "Full name",
        sort: true, 
        filter: textFilter(),
        headerFormatter: headerFormatter            
    },    
    {            
        dataField: "country",
        text: "Country",
        sort: true,
        filter: textFilter(),
        headerFormatter: headerFormatter 
    },
    {            
        dataField: "club.clubName",
        text: "Club",
        sort: true,
        filter: textFilter(),
        headerFormatter: headerFormatter 
    }
];


class AddParticipantToCampModal extends Component
{
    constructor(props)
    {        
        super(props);
        this.state = {
            campRegistration: {
                id: null,
                user: null,
                feeReceived: false,
                sayonaraMeetingParticipation: false,
                clothingSize: {
                    value: null,
                    label: ""
                },
                accommodation: false,
                campEvent: {
                    id: this.props.eventId                    
                }
            },
            clothingSizes: [],
            selectedRowsIds: []
        }        
        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
    }

    componentDidMount()
    {        
        fetch(CAMP_EVENTS + "/" + this.props.eventId + "/clothing_sizes")
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

    handleRowClick(selectedRowsIds)
    {
        this.setState({             
            selectedRowsIds: selectedRowsIds            
        });
    }

    handleRowSelection(selectedRowsIds)
    {
        this.setState({
            selectedRowsIds: selectedRowsIds
        });
    }

    handleClearForm()
    {
        this.setState({
            campRegistration: {
                id: null,
                user: null,
                feeReceived: false,
                sayonaraMeetingParticipation: false,
                clothingSize: {
                    value: null,
                    label: ""
                },
                accommodation: false,
                campEvent: {
                    id: this.props.eventId                    
                }
            },
            selectedRowsIds: []
        });
    }
    
    handleSignUp(e)
    {
        e.preventDefault();
        
        const t = this.props.t;

        if ( this.state.selectedRowsIds.length == 1 )
        {   
            let cs;
            if ( this.state.campRegistration.clothingSize.value == null && 
                    (this.state.campRegistration.clothingSize.label == "-" || this.state.campRegistration.clothingSize.label == "") )
                cs = null;
            else
                cs = {
                    id: this.state.campRegistration.clothingSize.value,
                    clothingSizeName: this.state.campRegistration.clothingSize.label
                };
            let campRegistration = {...this.state.campRegistration, clothingSize: cs, user: {id: this.state.selectedRowsIds[0]}};            
                        
            fetch(CAMP_REGISTRATIONS, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(campRegistration)           
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
        else alert(t("choose_one_person"));
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

        columns[Columns.FULL_NAME] = {...columns[Columns.FULL_NAME], text: t("full_name"), filter: textFilter({ placeholder: t("enter_full_name")})};
        columns[Columns.COUNTRY] = {...columns[Columns.COUNTRY], text: t("country"), filter: textFilter({ placeholder: t("enter_country")})};
        columns[Columns.CLUB] = {...columns[Columns.CLUB], text: t("club"), filter: textFilter({ placeholder: t("enter_club")})};

        return (
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
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
                    <Modal.Header>{t("add_participant_capital")}</Modal.Header>
                    <Modal.Body>
                        <Container>                            
                            {this.props.sayonaraMeeting && (
                                <Form.Group as={Row}>
                                    <Form.Label column sm="4">{t("sayonara_meeting")}</Form.Label>
                                    <Form.Check column sm="4"
                                        type="checkbox"
                                        name="sayonaraMeetingParticipation" 
                                        style={{display: "flex", alignItems: "center"}}
                                        checked={this.state.campRegistration.sayonaraMeetingParticipation}
                                        onChange={e => { 
                                            this.setState({ 
                                                campRegistration: {...this.state.campRegistration, sayonaraMeetingParticipation: e.target.checked} 
                                            }) 
                                        }}
                                    />
                                </Form.Group>
                            )}                            
                            <Form.Group as={Row}>
                                <Form.Label column sm="4">{t("clothing_size")}</Form.Label>
                                <Select
                                    styles={clothingSizesSelectStyles}
                                    options={this.state.clothingSizes}                                    
                                    value={this.state.campRegistration.clothingSize}
                                    onChange={clothingSize => {                                        
                                        this.setState({ campRegistration: {...this.state.campRegistration, clothingSize: clothingSize} })                                        
                                    }}
                                />
                            </Form.Group>                        
                            <Form.Group as={Row}>
                                <Form.Label column sm="4">{t("accommodation")}</Form.Label>
                                <Form.Check column sm="4"
                                    type="checkbox"
                                    name="accommodation" 
                                    style={{display: "flex", alignItems: "center"}}
                                    checked={this.state.campRegistration.accommodation}
                                    onChange={e => { this.setState({ campRegistration: {...this.state.campRegistration, accommodation: e.target.checked} }) }}
                                />
                            </Form.Group>
                        </Container>
                        <Container>
                            <Form.Group as={Row}>
                                <Form.Label column sm="4">{t("select_a_person")}</Form.Label>
                            </Form.Group>
                            <CrudTableComponent itemsUrl={USERS_API_URL} 
                                                tableColumns={columns} 
                                                selectedItemId={this.handleRowClick}
                                                selectedIds={this.handleRowSelection}                                                
                            />                         
                        </Container>                        
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <Button variant="info" type="submit">{t("save")}</Button>{' '}                            
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

export default withTranslation('translation', { withRef: true })(AddParticipantToCampModal);