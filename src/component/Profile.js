import React, {Component} from "react";
import {
    Card,
    Form,
    Row,
    Col,    
    Button,    
    Alert,
    OverlayTrigger,   
    Popover,    
} from "react-bootstrap";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { withTranslation } from "react-i18next";
import InformationDialogModal from "./InformationDialogModal";
import ConfirmationDialogModal from "./ConfirmationDialogModal";
import AuthService from "../service/auth-service";
import * as Urls from "../servers-urls";


const currentUser = AuthService.getCurrentUser();

const CLUBS_URL = Urls.WEBSERVICE_URL + "/clubs";
const RANKS_URL = Urls.WEBSERVICE_URL + "/ranks";
const BRANCH_CHIEFS_URL = Urls.WEBSERVICE_URL + "/branch_chiefs";
const USERS_URL = Urls.WEBSERVICE_URL + "/users/";


class Profile extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            user: {
                id: null,
                fullName: "",
                email: "",
                password: "",
                club: null,
                country: "",
                rank: null,
                branchChief: null,
                asTrainer: false
            },
            repeatPassword: "",
            formValidated: false,
            passwordNotMatchError: false,
            responseErrorMessage: false,
            clubs: [],
            ranks: [],
            branchChiefs: [],
            formValidated: false,
            showInformationModal: false,
            showConfirmationModal: false,
            errorMessage: null,            
        }

        this.loadUserToUpdate = this.loadUserToUpdate.bind(this);
        this.handleUpdateUser = this.handleUpdateUser.bind(this);
        this.askForProfileRemoving = this.askForProfileRemoving.bind(this);
        this.handleRemoveProfile = this.handleRemoveProfile.bind(this);        
    }

    componentDidMount()
    {
        let requests = [];

        const OptionsNames = Object.freeze({
            CLUBS: 0,
            RANKS: 1,
            BRANCH_CHIEFS: 2
        });
        
        requests.push(fetch(CLUBS_URL, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        }));
        requests.push(fetch(RANKS_URL, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        }));
        requests.push(fetch(BRANCH_CHIEFS_URL, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        }));

        Promise.all(requests)
        .then(responses => responses.map(response => response.json()))
        .then(jsonResponses => {
            Promise.all(jsonResponses)
            .then(data => {
                let clubs = data[OptionsNames.CLUBS];
                let c = [];
                c.push( { value: null, label: "-" } );
                clubs.forEach(club => c.push( {value: club.id, label: club.clubName} ));

                let ranks = data[OptionsNames.RANKS];
                let r = [];
                r.push( { value: null, label: "-" } );
                ranks.forEach(rank => r.push( {value: rank.id, label: rank.rankName} ));

                let branchChiefs = data[OptionsNames.BRANCH_CHIEFS];
                let bc = [];
                bc.push( { value: null, label: "-" } );
                branchChiefs.forEach(branchChief => bc.push( {value: branchChief.id, label: branchChief.branchChiefName} ));

                this.setState({
                    clubs: c,
                    ranks: r,
                    branchChiefs: bc
                }, () => this.loadUserToUpdate());
            })
        })
    }

    loadUserToUpdate()
    {
        fetch(USERS_URL + currentUser.id, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        })
        .then(response => response.json())
        .then(data => {
            let club;
            if(data.club == null)
                club = {
                    value: null,
                    label: "-"
                }
            else
                club = {
                    value: data.club.id,
                    label: data.club.clubName
                }

            let rank;
            if(data.rank == null)
                rank = {
                    value: null,
                    label: "-"
                }
            else
                rank = {
                    value: data.rank.id,
                    label: data.rank.rankName
                }

            let branchChief;
            if(data.branchChief == null)
                branchChief = {
                    value: null,
                    label: "-"
                }
            else
                branchChief = {
                    value: data.branchChief.id,
                    label: data.branchChief.branchChiefName
                }

            this.setState({ user: {...data, club: club, rank: rank, branchChief: branchChief} });
        })
    }

    handleUpdateUser(e)
    {
        e.preventDefault();
        this.setState({
            errorMessage: null,
            showInformationModal: false
        });  

        const t = this.props.t;

        let club;
        if ( this.state.user.club.value == null && this.state.user.club.label == "-" )
            club = null;
        else 
            club = {
                id: this.state.user.club.value,
                clubName: this.state.user.club.label
            };

        let rank;
        if ( this.state.user.rank.value == null && this.state.user.rank.label == "-" )
            rank = null;
        else
            rank = {
                id: this.state.user.rank.value,
                rankName: this.state.user.rank.label
            };

        let branchChief;
        if (this.state.user.branchChief.value == null && this.state.user.branchChief.label == "-")
            branchChief = null;
        else
            branchChief = {
                id: this.state.user.branchChief.value,
                branchChiefName: this.state.user.branchChief.label
            };

        let userToUpdate = {...this.state.user, club: club, rank: rank, branchChief: branchChief};

        if(e.currentTarget.checkValidity())
        {
            this.setState({ formValidated: true });
            
            fetch(USERS_URL, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + currentUser.accessToken
                },
                body: JSON.stringify(userToUpdate)
            })
            .then(result => {
                if(result.ok) 
                    this.setState({ showInformationModal: true });                    
                else return result.json();
            },
            error => {this.setState({ errorMessage: error.message })})
            .then(result => {
                if(typeof result != "undefined")                   
                    this.setState({ errorMessage: t(result.message) });
            });
        }
        else this.setState({
            formValidated: true,
            errorMessage: t("fill_all_required_fields")
        });
    }

    askForProfileRemoving()
    {
        this.setState({ showConfirmationModal: true });
    }

    handleRemoveProfile(result)
    {
        if (result)
        {
            const t = this.props.t;
            
            let userToRemove = {...this.state.user, 
                fullName: "account_removed",
                email: null,
                password: "",
                club: null,
                country: "",
                rank: null,
                branchChief: null,
                asTrainer: false,
                roles: []
            }

            fetch(USERS_URL, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + currentUser.accessToken
                },
                body: JSON.stringify(userToRemove)
            })
            .then(result => {
                if(result.ok) 
                    AuthService.logout().then(() => window.location.reload());                    
                else return result.json();
            },
            error => {this.setState({ errorMessage: error.message })})
            .then(result => {
                if(typeof result != "undefined")                   
                    this.setState({ errorMessage: t(result.message) });
            });            
        }            
    }

    render()
    {        
        const selectStyles = {
            container: base => ({
                ...base,
                flex: 1,                
            })            
        };
        const t = this.props.t;
        this.props.navbarControlsHandler();

        return(
            currentUser != null ?
            (   
                <div>
                    <ConfirmationDialogModal    show={this.state.showConfirmationModal}
                                                onHide={() => this.setState({ showConfirmationModal: false }) }
                                                confirmationResult={this.handleRemoveProfile}                                                
                    /> 
                    <InformationDialogModal modalContent={t("data_updated_succesfully")} 
                                            show={this.state.showInformationModal}
                                            onHide={() => {
                                                this.setState({ showInformationModal: false });
                                                window.location.reload();   
                                            }} 
                    />
                    <Card>
                        <Card.Body>
                            {this.state.errorMessage && (<Alert variant="danger">{this.state.errorMessage}</Alert>)}                            
                            <Form noValidate validated={this.state.formValidated} onSubmit={this.handleUpdateUser}>
                                <Card>
                                    <Card.Header>{t("basic_information")}</Card.Header>
                                    <Card.Body>
                                        <Form.Group>                                       
                                            <Form.Control required
                                                placeholder={t("full_name")}
                                                type="text"
                                                name="fullName"                                                 
                                                maxLength="255"                                   
                                                value={this.state.user.fullName}
                                                onChange={e => this.setState(state => ({ user: {...state.user, fullName: e.target.value} })) }                            
                                            />
                                            <Form.Control.Feedback>{t("looks_good")}</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">{t("provide_full_name")}</Form.Control.Feedback>                                        
                                        </Form.Group>
                                        <Form.Group>                                        
                                            <Form.Control required
                                                placeholder="Email"
                                                type="email"
                                                name="email" 
                                                maxLength="255"                                   
                                                value={this.state.user.email}
                                                onChange={e => this.setState(state => ({ user: {...state.user, email: e.target.value} })) }                            
                                            />
                                            <Form.Control.Feedback>{t("looks_good")}</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">{t("provide_valid_email")}</Form.Control.Feedback>                                        
                                        </Form.Group>
                                        {this.state.passwordNotMatchError && (<Alert variant="danger">{this.state.passwordNotMatchError}</Alert>)}                                    
                                    </Card.Body>
                                </Card>
                                <div style={{height: "16px"}}></div>
                                <Card>
                                    <Card.Header>{t("details")}</Card.Header>
                                    <Card.Body>
                                        <Form.Group>                                                                              
                                            <OverlayTrigger trigger="hover" placement="top" overlay={(                            
                                                <Popover>
                                                    <Popover.Content>{t("select_or_enter_your_own")}</Popover.Content>
                                                </Popover>
                                            )}>
                                                <div>
                                                    <CreatableSelect required
                                                        placeholder={t("club")}
                                                        styles={selectStyles}
                                                        options={this.state.clubs}                                    
                                                        value={this.state.user.club}
                                                        onChange={club => this.setState(state => ({ user: {...state.user, club: club} }))}                                                                                      
                                                    />
                                                </div>                                                                     
                                            </OverlayTrigger>                       
                                        </Form.Group>
                                        <Form.Row>
                                            <Col md="8">
                                                <Form.Group>                                                
                                                    <Form.Control required
                                                        placeholder={t("country")}
                                                        type="text"
                                                        name="country" 
                                                        maxLength="255"                                   
                                                        value={this.state.user.country}
                                                        onChange={e => this.setState(state => ({ user: {...state.user, country: e.target.value} }))}                            
                                                    />
                                                    <Form.Control.Feedback>{t("looks_good")}</Form.Control.Feedback>
                                                    <Form.Control.Feedback type="invalid">{t("provide_country")}</Form.Control.Feedback>                                        
                                                </Form.Group>
                                            </Col>
                                            <Col md="4">
                                                <Form.Group>                                                
                                                    <Select
                                                        placeholder={t("rank")}
                                                        styles={selectStyles}
                                                        options={this.state.ranks}                                    
                                                        value={this.state.user.rank}
                                                        onChange={rank => this.setState(state => ({ user: {...state.user, rank: rank} }))}                                                                                                           
                                                    />                                       
                                                </Form.Group>
                                            </Col>
                                        </Form.Row>
                                        <Form.Group>                                        
                                            <OverlayTrigger trigger="hover" placement="top" overlay={(                            
                                                <Popover>
                                                    <Popover.Content>{t("select_or_enter_your_own")}</Popover.Content>
                                                </Popover>
                                            )}>
                                                <div>
                                                    <CreatableSelect
                                                        placeholder="Branch Chief / Dojo Operator"
                                                        styles={selectStyles}
                                                        options={this.state.branchChiefs}                                    
                                                        value={this.state.user.branchChief}
                                                        onChange={branchChief => this.setState(state => ({ user: {...state.user, branchChief: branchChief} }))}                                                                                      
                                                    />
                                                </div>                                                                     
                                            </OverlayTrigger> 
                                        </Form.Group>                                    
                                    </Card.Body>
                                </Card> <br />
                                <Card.Footer style={{paddingRight: "0px", paddingBottom: "0px", paddingTop: "1.25rem"}}>
                                    <div className="d-flex flex-row-reverse"> 
                                        <Button variant="info" type="submit">{t("save")}</Button>                            
                                    </div>
                                </Card.Footer>
                            </Form>
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

export default withTranslation('translation', { withRef: true })(Profile);