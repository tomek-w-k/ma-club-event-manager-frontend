import React, {Component} from "react";
import {
    Card,
    Form,
    Row,
    Col,    
    Button,    
    Alert,    
} from "react-bootstrap";
import {Link} from "react-router-dom";
import { withTranslation } from "react-i18next";
import InformationDialogModal from "../InformationDialogModal";
import AuthService from "../../service/auth-service";
import * as Urls from "../../servers-urls";


class Login extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            user: {                
                email: "",
                password: ""                
            },            
            formValidated: false,            
            responseErrorMessage: false,
            emailSentToPasswordResetDialogShow: false            
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleSendEmailToPasswordReset = this.handleSendEmailToPasswordReset.bind(this);
    }

    componentDidMount()
    {        
        this.setState(state => ({ user: {...state.user, email: this.props.match.params.email != "@" ? this.props.match.params.email : ""} }));
    }

    handleLogin(e)
    {
        e.preventDefault();

        const t =  this.props.t;

        if ( e.currentTarget.checkValidity() )
        {
            this.setState({ formValidated: true });

            AuthService.login(this.state.user.email, this.state.user.password)
            .then( () => {
                this.props.history.push("/event_wall_component");
                window.location.reload();
            },
            error => this.setState({ responseErrorMessage: t("login_failed") }) );
        }
        else this.setState({ formValidated: true });
    }

    handleSendEmailToPasswordReset()
    {        
        const t = this.props.t;
        
        fetch(Urls.WEBSERVICE_URL + "/reset_password/generate_token", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"                
            },
            body: JSON.stringify({ email: this.state.user.email })
        })
        .then(result => {
            if ( result.ok )            
                this.setState({ emailSentToPasswordResetDialogShow: true });                        
            else this.setState({ responseErrorMessage: t("email_not_exist") });                        
        },
        error => this.setState({ responseErrorMessage: t("email_not_sent") }) )
    }

    render()
    {   
        const t = this.props.t;
        
        return (
            <div>
                <InformationDialogModal modalTitle={t("password_resetting_capital")}
                                        modalContent={t("email_sent_confirmation")} 
                                        show={this.state.emailSentToPasswordResetDialogShow}
                                        onHide={() => {
                                            this.setState({ 
                                                emailSentToPasswordResetDialogShow: false,
                                                responseErrorMessage: false
                                            });                                               
                                        }} 
                />
                <Row>
                    <Col md="2"></Col>
                    <Col md="8" style={{marginTop: '150px'}}>
                        <Card>
                            <Card.Body>
                                {this.state.responseErrorMessage && (<Alert variant="danger">{this.state.responseErrorMessage}</Alert>)}
                                <Form noValidate validated={this.state.formValidated} onSubmit={this.handleLogin}>
                                    <Card>
                                        <Card.Header>{t("login_capital")}</Card.Header>
                                        <Card.Body>                                        
                                            {this.state.passwordNotMatchError && (<Alert variant="danger">{this.state.passwordNotMatchError}</Alert>)}  
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
                                            <Form.Group>                                                
                                                <Form.Control required
                                                    autocomplete="new-password"                                                       
                                                    placeholder={t("password")}
                                                    type="password"
                                                    name="password"                 
                                                    value={this.state.user.password}
                                                    onChange={e => this.setState(state => ({ user: {...state.user, password: e.target.value} })) }                            
                                                />
                                                <Form.Control.Feedback>{t("looks_good")}</Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">{t("provide_password")}</Form.Control.Feedback>                                        
                                            </Form.Group>
                                            <Link onClick={() => this.handleSendEmailToPasswordReset()}>{t("i_forgot_password")}</Link> 
                                        </Card.Body>
                                    </Card> <br />               
                                    <Button variant="info" style={{width: "100%"}} type="submit">{t("login")}</Button>
                                </Form>
                            </Card.Body>                        
                        </Card>
                    </Col>
                    <Col md="2"></Col>
                </Row>
            </div>
        );
    }
}

export default withTranslation('translation', { withRef: true })(Login);