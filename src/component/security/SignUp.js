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
    FormGroup
} from "react-bootstrap";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import AuthService from "../../service/auth-service";
import * as Urls from "../../servers-urls";


class SignUp extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            user: {
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
            branchChiefs: []
        }

        this.handleSignUp = this.handleSignUp.bind(this);
    }

    componentDidMount()
    {
        let requests = [];  
        
        const OptionsNames = Object.freeze ({
            CLUBS: 0,
            RANKS: 1,
            BRANCH_CHIEFS: 2
        });
         
        requests.push(fetch(Urls.WEBSERVICE_URL + "/clubs"));
        requests.push(fetch(Urls.WEBSERVICE_URL + "/ranks"));
        requests.push(fetch(Urls.WEBSERVICE_URL + "/branch_chiefs"));

        Promise.all(requests)
        .then(responses =>  responses.map(response => response.json()) )
        .then(jsonResponses => {            
            Promise.all(jsonResponses)
            .then(data => { 
                let clubs = data[OptionsNames.CLUBS];
                let c = [];
                clubs.forEach(club => c.push( { value: club.id, label: club.clubName } ) );

                let ranks = data[OptionsNames.RANKS];
                let r = [];
                ranks.forEach(rank => r.push( { value: rank.id, label: rank.rankName } ) );

                let branchChiefs = data[OptionsNames.BRANCH_CHIEFS];
                let bc = [];
                branchChiefs.forEach(branchChief => bc.push( { value: branchChief.id, label: branchChief.branchChiefName } ));

                this.setState({ 
                    clubs: c,
                    ranks: r,
                    branchChiefs: bc
                });
            });
        });  
    }
    
    handleSignUp(e)
    {
        e.preventDefault();
        this.setState({ passwordNotMatchError: false });

        if (this.state.user.password != this.state.repeatPassword)
        {
            this.setState({ passwordNotMatchError: "The entered password does not match repeated password." });
            return;
        }
        
        if ( e.currentTarget.checkValidity() )
        {
            this.setState({ formValidated: true });

            let selectedClub = null;
            if ( this.state.user.club )                
                selectedClub = {
                    id: this.state.user.club.__isNew__ ? null : this.state.user.club.value,
                    clubName: this.state.user.club.label
                };

            let selectedRank = null;
            if ( this.state.user.rank )
                selectedRank = {
                    id: this.state.user.rank.value,
                    rankName: this.state.user.rank.label
                };

            let selectedBranchChief = null;
            if ( this.state.user.branchChief )
                selectedBranchChief = {
                    id: this.state.user.branchChief.__isNew__ ? null : this.state.user.branchChief.value,
                    branchChiefName: this.state.user.branchChief.label
                };

            let userToRegister = {...this.state.user,
                club: selectedClub,
                rank: selectedRank,
                branchChief: selectedBranchChief
            };

            console.log(userToRegister);

            AuthService.register(
                userToRegister.fullName,
                userToRegister.email,
                userToRegister.password,
                userToRegister.club,
                userToRegister.country,
                userToRegister.rank,
                userToRegister.branchChief,
                userToRegister.asTrainer
            )
            .then(response => {               
                //console.log("aaaaaa ", response) ;
                console.log(response.data.email);
                console.log(response.data.password);
                
                this.props.history.push("/login/" + response.data.email);
            },
            error => {
                const resMessage = 
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({ responseErrorMessage: resMessage });
            })
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

        return (
            <Row>
                <Col md="2"></Col>
                <Col md="8" style={{marginTop: '30px'}}>
                    <Card>
                        <Card.Body>
                            {this.state.responseErrorMessage && (<Alert variant="danger">{this.state.responseErrorMessage}</Alert>)}
                            <Form noValidate validated={this.state.formValidated} onSubmit={this.handleSignUp}>
                                <Card>
                                    <Card.Header>LOGIN INFORMATION</Card.Header>
                                    <Card.Body>
                                        <Form.Group>                                       
                                            <Form.Control required
                                                placeholder="Full name"
                                                type="text"
                                                name="fullName"                                                 
                                                maxLength="255"                                   
                                                value={this.state.user.fullName}
                                                onChange={e => this.setState(state => ({ user: {...state.user, fullName: e.target.value} })) }                            
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">Please provide your full name.</Form.Control.Feedback>                                        
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
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">Please provide a valid email.</Form.Control.Feedback>                                        
                                        </Form.Group>
                                        {this.state.passwordNotMatchError && (<Alert variant="danger">{this.state.passwordNotMatchError}</Alert>)}
                                        <Form.Row>
                                            <Col>
                                                <Form.Group>                                                
                                                    <Form.Control required
                                                        autocomplete="on"                                                        
                                                        placeholder="Password"
                                                        type="password"
                                                        name="password"
                                                        minLength="3"
                                                        maxLength="40"                                    
                                                        value={this.state.user.password}
                                                        onChange={e => this.setState(state => ({ user: {...state.user, password: e.target.value} })) }                            
                                                    />
                                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                                    <Form.Control.Feedback type="invalid">Please provide a password (3 - 40 characters).</Form.Control.Feedback>                                        
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group>                                                
                                                    <Form.Control required
                                                        autocomplete="off"
                                                        placeholder="Repeat password"
                                                        type="password"
                                                        name="repeatPassword"  
                                                        minLength="3"
                                                        maxLength="40"                                    
                                                        value={this.state.repeatPassword}
                                                        onChange={e => this.setState({ repeatPassword: e.target.value }) }                            
                                                    />
                                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                                    <Form.Control.Feedback type="invalid">Please repeat your password (3 - 40 characters).</Form.Control.Feedback>                                        
                                                </Form.Group>
                                            </Col>
                                        </Form.Row>
                                    </Card.Body>
                                </Card>
                                <div style={{height: "16px"}}></div>
                                <Card>
                                    <Card.Header>DETAILS</Card.Header>
                                    <Card.Body>
                                        <Form.Group>                                                                              
                                            <OverlayTrigger trigger="hover" placement="top" overlay={(                            
                                                <Popover>
                                                    <Popover.Content>Please select from the list or enter your own</Popover.Content>
                                                </Popover>
                                            )}>
                                                <div>
                                                    <CreatableSelect required
                                                        placeholder="Club"
                                                        styles={selectStyles}
                                                        options={this.state.clubs}                                    
                                                        value={this.state.club}
                                                        onChange={club => this.setState(state => ({ user: {...state.user, club: club} }))}                                                                                      
                                                    />
                                                </div>                                                                     
                                            </OverlayTrigger>                       
                                        </Form.Group>
                                        <Form.Row>
                                            <Col md="8">
                                                <Form.Group>                                                
                                                    <Form.Control required
                                                        placeholder="Country"
                                                        type="text"
                                                        name="country" 
                                                        maxLength="255"                                   
                                                        value={this.state.user.country}
                                                        onChange={e => this.setState(state => ({ user: {...state.user, country: e.target.value} }))}                            
                                                    />
                                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                                    <Form.Control.Feedback type="invalid">Please provide your country.</Form.Control.Feedback>                                        
                                                </Form.Group>
                                            </Col>
                                            <Col md="4">
                                                <Form.Group>                                                
                                                    <Select
                                                        placeholder="Rank"
                                                        styles={selectStyles}
                                                        options={this.state.ranks}                                    
                                                        value={this.state.rank}
                                                        onChange={rank => this.setState(state => ({ user: {...state.user, rank: rank} }))}                                                                                                           
                                                    />                                       
                                                </Form.Group>
                                            </Col>
                                        </Form.Row>
                                        <Form.Group>                                        
                                            <OverlayTrigger trigger="hover" placement="top" overlay={(                            
                                                <Popover>
                                                    <Popover.Content>Please select from the list or enter your own</Popover.Content>
                                                </Popover>
                                            )}>
                                                <div>
                                                    <CreatableSelect
                                                        placeholder="Branch Chief / Dojo Operator"
                                                        styles={selectStyles}
                                                        options={this.state.branchChiefs}                                    
                                                        value={this.state.branchChief}
                                                        onChange={branchChief => this.setState(state => ({ user: {...state.user, branchChief: branchChief} }))}                                                                                      
                                                    />
                                                </div>                                                                     
                                            </OverlayTrigger> 
                                        </Form.Group>
                                        <Form.Group>                                            
                                            <Form.Check 
                                                label="I want to be able to register teams for tournaments"
                                                type="checkbox"
                                                name="asTrainer"                                                 
                                                checked={this.state.user.asTrainer}
                                                onChange={e => this.setState(state => ({ user: {...state.user, asTrainer: e.target.checked} }))}
                                            />
                                        </Form.Group> 
                                    </Card.Body>
                                </Card> <br />                            
                                <Button variant="info" style={{width: "100%"}} type="submit">Sign up</Button>
                            </Form>
                        </Card.Body>                        
                    </Card>
                </Col>
                <Col md="2"></Col>
            </Row>
        );
    }
}

export default SignUp;