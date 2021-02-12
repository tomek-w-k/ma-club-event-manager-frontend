import React, {Component} from "react";
import {withTranslation} from "react-i18next";
import InformationDialogModal from "../InformationDialogModal";
import {
    Form,
    Card,
    Row,
    Col,
    Alert,
    Button
} from "react-bootstrap";
import { 
    Redirect,
    Link
} from "react-router-dom";
import * as Urls from "../../servers-urls";


const TOKEN_EXPIRED_HTTP_STATUS = '498';
const RESOURCE_NOT_FOUND_HTTP_STATUS = '404';


class PasswordReset extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            redirectToLoginPage: false,
            formValidated: false,
            passwordsNotIdentical: false,
            errorMessage: null,
            passwordChangedSuccesfully: false
        }        
        this.validateToken = this.validateToken.bind(this);
        this.handleResetPassword = this.handleResetPassword.bind(this);
    }

    componentDidMount()
    {         
        this.validateToken();
    }

    validateToken()
    {
        const t = this.props.t;   
        let token = this.props.match.params.token;
        
        fetch(Urls.WEBSERVICE_URL + "/reset_password/validate_token/" + token)
        .then(response => {
            if ( response.status == TOKEN_EXPIRED_HTTP_STATUS )            
                this.setState({ errorMessage: t("reset_password_link_expired") });

            if ( response.status == RESOURCE_NOT_FOUND_HTTP_STATUS )             
                this.setState({ errorMessage: t("reset_password_link_damaged") });
        });        
    }

    handleResetPassword(event)
    {
        const t = this.props.t;
        let password = event.target.password.value;
        let confirm = event.target.confirm.value;
        let token = this.props.match.params.token;
        
        event.preventDefault();
        
        if ( event.currentTarget.checkValidity() )
        {
            this.setState({ formValidated: true });

            if ( password == confirm )
            {
                fetch(Urls.WEBSERVICE_URL + "/reset_password/reset_password/", {
                    method: "PUT",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        token: token,
                        password: password
                    })
                })
                .then(result => {                    
                    if ( result.ok )                                    
                        this.setState({ passwordChangedSuccesfully: true });                
                    else this.setState({ errorMessage: t("error_password_not_changed") });
                },
                error => this.setState({ errorMessage: t("error_password_not_changed") }) )
            }
            else this.setState({ passwordsNotIdentical: t("passwords_not_identical") });
        }
        else this.setState({ formValidated: true });
    }

    render()
    {
        const t = this.props.t;

        if ( this.state.redirectToLoginPage )
            return( <Redirect to="/login/@"/> )

        return(
            <div>
                <InformationDialogModal modalTitle={t("password_resetting_capital")}
                                        modalContent={t("password_changed_succesfully")} 
                                        show={this.state.passwordChangedSuccesfully}
                                        onHide={() => {
                                            this.setState({ 
                                                passwordChangedSuccesfully: false,
                                                redirectToLoginPage: true
                                             });                                                                                           
                                        }} 
                />
                <Row>
                    <Col md="2"></Col>
                    <Col md="8" style={{marginTop: '150px'}}>
                        <Card>
                            <Card.Body>
                                {this.state.errorMessage ?                                 (
                                    <Alert variant="danger">
                                        {this.state.errorMessage}
                                        <div style={{padding: "10px"}}></div>                                            
                                        <div className="d-flex flex-row-reverse"> 
                                            <Link to="/login/@" className="btn btn-secondary">{t("go_to_login_page")}</Link>
                                        </div>   
                                    </Alert>
                                ) : (
                                    <Form noValidate validated={this.state.formValidated} onSubmit={this.handleResetPassword}>
                                        <Card>
                                            <Card.Header>{t("password_resetting_capital")}</Card.Header>
                                            <Card.Body>
                                                {this.state.passwordsNotIdentical && (<Alert variant="danger">{this.state.passwordsNotIdentical}</Alert>)}  
                                                <Form.Group>                                                
                                                    <Form.Control required
                                                        autoComplete="new-password"                                                       
                                                        placeholder={t("password")}
                                                        type="password"
                                                        name="password"         
                                                    />
                                                    <Form.Control.Feedback>{t("looks_good")}</Form.Control.Feedback>
                                                    <Form.Control.Feedback type="invalid">{t("provide_password")}</Form.Control.Feedback>                                        
                                                </Form.Group>                              
                                                <Form.Group>                                                
                                                    <Form.Control required
                                                        autocomplete="new-password"                                                       
                                                        placeholder={t("repeat_password")}
                                                        type="password"
                                                        name="confirm"             
                                                    />
                                                    <Form.Control.Feedback>{t("looks_good")}</Form.Control.Feedback>
                                                    <Form.Control.Feedback type="invalid">{t("provide_password")}</Form.Control.Feedback>                                        
                                                </Form.Group>                                            
                                            </Card.Body>
                                        </Card> <br />               
                                        <Button variant="info" style={{width: "100%"}} type="submit">{t("reset_password")}</Button>
                                    </Form>
                                )}                                
                            </Card.Body>                        
                        </Card>
                    </Col>
                    <Col md="2"></Col>
                </Row>
            </div>
        );
    }
}

export default withTranslation()(PasswordReset);