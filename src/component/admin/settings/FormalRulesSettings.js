import React, { Component } from "react";
import {
    Card,
    Form, 
    Button,
    Alert,
    Tabs,
    Tab,
    Nav,
    Row,
    Col
} from "react-bootstrap";
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as SettingsConstants from "./settingsConstants";
import * as Urls from "../../../servers-urls";
import { handleFetchErrors, handleMultipleFetchErrors } from "../../../utils/handleFetchErrors";
import InformationDialogModal from "../../InformationDialogModal";
import { fetchMetadataForGet } from "../../../utils/fetchMetadata";


const currentUser = AuthService.getCurrentUser();


class FormalRulesSettings extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            termsAndConditionsPl: "",
            termsAndConditionsEn: "",
            privacyPolicyPl: "",
            privacyPolicyEn: "",
            gdprClausePl: "",
            gdprClauseEn: "",            
            termsAndConditionsPlFormValidated: false,
            termsAndConditionsEnFormValidated: false,
            privacyPolicyContentPlFormValidated: false,
            privacyPolicyContentEnFormValidated: false,
            gdprClausePlFormValidated: false,
            gdprClauseEnFormValidated: false,            
            showInformationModal: false,
            popupErrorMessage: "",
            errorMessage: "",
        }        
        this.handleUpdateProperty = this.handleUpdateProperty.bind(this);        
        this.handleSaveTermsAndConditionsPl = this.handleSaveTermsAndConditionsPl.bind(this);
        this.handleSaveTermsAndConditionsEn = this.handleSaveTermsAndConditionsEn.bind(this);
        this.handleSavePrivacyPolicyPl = this.handleSavePrivacyPolicyPl.bind(this);
        this.handleSavePrivacyPolicyEn = this.handleSavePrivacyPolicyEn.bind(this);
        this.handleSaveGdprClausePl = this.handleSaveGdprClausePl.bind(this);
        this.handleSaveGdprClauseEn = this.handleSaveGdprClauseEn.bind(this);
    }

    componentDidMount()
    {
        const t = this.props.t; 

        let formalRulesRequests = [];
        formalRulesRequests.push( fetch(SettingsConstants.TERMS_AND_CONDITIONS_PL, fetchMetadataForGet(currentUser)) );
        formalRulesRequests.push( fetch(SettingsConstants.TERMS_AND_CONDITIONS_EN, fetchMetadataForGet(currentUser)) );
        formalRulesRequests.push( fetch(SettingsConstants.PRIVACY_POLICY_PL, fetchMetadataForGet(currentUser)) );
        formalRulesRequests.push( fetch(SettingsConstants.PRIVACY_POLICY_EN, fetchMetadataForGet(currentUser)) );
        formalRulesRequests.push( fetch(SettingsConstants.GDPR_CLAUSE_PL, fetchMetadataForGet(currentUser)) );
        formalRulesRequests.push( fetch(SettingsConstants.GDPR_CLAUSE_EN, fetchMetadataForGet(currentUser)) );

        Promise.all(formalRulesRequests)
        .then(handleMultipleFetchErrors)
        .then(responses => responses.map(response => response.json()))
        .then(jsonResponses => Promise.all(jsonResponses)
        .then(data => { 
            this.setState({
                termsAndConditionsPl: data[SettingsConstants.FormalRules.TERMS_AND_CONDITIONS_PL].value,
                termsAndConditionsEn: data[SettingsConstants.FormalRules.TERMS_AND_CONDITIONS_EN].value,
                privacyPolicyPl: data[SettingsConstants.FormalRules.PRIVACY_POLICY_PL].value,
                privacyPolicyEn: data[SettingsConstants.FormalRules.PRIVACY_POLICY_EN].value,
                gdprClausePl: data[SettingsConstants.FormalRules.GDPR_CLAUSE_PL].value,
                gdprClauseEn: data[SettingsConstants.FormalRules.GDPR_CLAUSE_EN].value
            });
        }))
        .catch(error => this.setState({ errorMessage: t("failed_to_fetch") }));        
    }

    handleUpdateProperty(key, value)
    {
        const t = this.props.t;
        
        fetch(SettingsConstants.PROPERTY_URL, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentUser.accessToken
            },
            body: JSON.stringify({ key: key, value: value })
        })
        .then(handleFetchErrors)
        .then(() => this.setState({ 
                            popupErrorMessage: t("data_saved_succesfully"),
                            showInformationModal: true,
                            formValidated: false, 
                            errorMessage: ""                           
         }) )
        .catch(() => this.setState({ errorMessage: t("failed_to_save") })  )
    }

    handleSaveTermsAndConditionsPl(e)
    {
        e.preventDefault();
        
        if ( e.currentTarget.checkValidity() )
            this.handleUpdateProperty("terms_and_conditions_pl", this.state.termsAndConditionsPl);
        else this.setState({ termsAndConditionsPlFormValidated: true });
    }

    handleSaveTermsAndConditionsEn(e)
    {
        e.preventDefault();
        
        if ( e.currentTarget.checkValidity() )
            this.handleUpdateProperty("terms_and_conditions_en", this.state.termsAndConditionsEn);
        else this.setState({ termsAndConditionsEnFormValidated: true });
    }
    
    handleSavePrivacyPolicyPl(e)
    {
        e.preventDefault();
        
        if ( e.currentTarget.checkValidity() )
            this.handleUpdateProperty("privacy_policy_pl", this.state.privacyPolicyPl);
        else this.setState({ privacyPolicyContentPlFormValidated: true });
    }

    handleSavePrivacyPolicyEn(e)
    {
        e.preventDefault();
        
        if ( e.currentTarget.checkValidity() )
            this.handleUpdateProperty("privacy_policy_en", this.state.privacyPolicyEn);
        else this.setState({ privacyPolicyContentEnFormValidated: true });
    }

    handleSaveGdprClausePl(e)
    {
        e.preventDefault();
        
        if ( e.currentTarget.checkValidity() )
            this.handleUpdateProperty("gdpr_clause_pl", this.state.gdprClausePl);
        else this.setState({ gdprClausePlFormValidated: true });
    }

    handleSaveGdprClauseEn(e)
    {
        e.preventDefault();
        
        if ( e.currentTarget.checkValidity() )
            this.handleUpdateProperty("gdpr_clause_en", this.state.gdprClauseEn);
        else this.setState({ gdprClauseEnFormValidated: true });
    }

    render()
    {
        const t = this.props.t;

        return (
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <div>                     
                    <InformationDialogModal modalContent={this.state.popupErrorMessage} 
                                            show={this.state.showInformationModal}
                                            onHide={() => this.setState({ 
                                                popupErrorMessage: "",
                                                showInformationModal: false,
                                            })} 
                    />
                    <Card>
                        <Card.Body>
                            <Tab.Container id="left-tabs-example" defaultActiveKey="termsAndConditionsPl">
                            <Row>
                                <Col sm={2}>
                                    <Nav variant="pills" className="flex-column formal-rules">
                                        <Nav.Item><Nav.Link eventKey="termsAndConditionsPl">{t("termsAndConditionsPl")}</Nav.Link></Nav.Item>
                                        <Nav.Item><Nav.Link eventKey="termsAndConditionsEn">{t("termsAndConditionsEn")}</Nav.Link></Nav.Item>
                                        <Nav.Item><Nav.Link eventKey="privacyPolicyContentPl">{t("privacyPolicyContentPl")}</Nav.Link></Nav.Item>
                                        <Nav.Item><Nav.Link eventKey="privacyPolicyContentEn">{t("privacyPolicyContentEn")}</Nav.Link></Nav.Item>
                                        <Nav.Item><Nav.Link eventKey="gdprClausePl">{t("gdprClausePl")}</Nav.Link></Nav.Item>
                                        <Nav.Item><Nav.Link eventKey="gdprClauseEn">{t("gdprClauseEn")}</Nav.Link></Nav.Item>
                                    </Nav>
                                </Col>
                                <Col sm={10}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="termsAndConditionsPl">
                                        <Form noValidate validated={this.state.termsAndConditionsPlFormValidated} onSubmit={this.handleSaveTermsAndConditionsPl}>
                                            <Form.Group>                                        
                                                <Form.Control
                                                    rows="20"                                            
                                                    as="textarea"
                                                    name="termsAndConditionsPl"
                                                    value={this.state.termsAndConditionsPl}
                                                    onChange={(e) => { this.setState({ termsAndConditionsPl: e.target.value }) }}
                                                />
                                            </Form.Group>
                                            <Card.Footer style={{paddingRight: "0px", paddingBottom: "0px", paddingTop: "1.25rem"}}>
                                                <div className="d-flex flex-row-reverse">
                                                    <Button variant="info" type="submit">{t("post")}</Button>                            
                                                </div>
                                            </Card.Footer>
                                        </Form>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="termsAndConditionsEn">
                                        <Form noValidate validated={this.state.termsAndConditionsEnFormValidated} onSubmit={this.handleSaveTermsAndConditionsEn}>
                                            <Form.Group>                                        
                                                <Form.Control
                                                    rows="20"                                            
                                                    as="textarea"
                                                    name="termsAndConditionsEn"
                                                    value={this.state.termsAndConditionsEn}
                                                    onChange={(e) => { this.setState({ termsAndConditionsEn: e.target.value }) }}
                                                />
                                            </Form.Group>
                                            <Card.Footer style={{paddingRight: "0px", paddingBottom: "0px", paddingTop: "1.25rem"}}>
                                                <div className="d-flex flex-row-reverse">
                                                    <Button variant="info" type="submit">{t("post")}</Button>                            
                                                </div>
                                            </Card.Footer>
                                        </Form>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="privacyPolicyContentPl">
                                        <Form noValidate validated={this.state.privacyPolicyContentPlFormValidated} onSubmit={this.handleSavePrivacyPolicyPl}>
                                            <Form.Group>                                        
                                                <Form.Control
                                                    rows="20"                                            
                                                    as="textarea"
                                                    name="privacyPolicyContentPl"
                                                    value={this.state.privacyPolicyPl}
                                                    onChange={(e) => { this.setState({ privacyPolicyPl: e.target.value }) }}
                                                />
                                            </Form.Group>
                                            <Card.Footer style={{paddingRight: "0px", paddingBottom: "0px", paddingTop: "1.25rem"}}>
                                                <div className="d-flex flex-row-reverse">
                                                    <Button variant="info" type="submit">{t("post")}</Button>                            
                                                </div>
                                            </Card.Footer>
                                        </Form>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="privacyPolicyContentEn">
                                        <Form noValidate validated={this.state.privacyPolicyContentEnFormValidated} onSubmit={this.handleSavePrivacyPolicyEn}>
                                            <Form.Group>                                        
                                                <Form.Control
                                                    rows="20"                                            
                                                    as="textarea"
                                                    name="privacyPolicyContentEn"
                                                    value={this.state.privacyPolicyEn}
                                                    onChange={(e) => { this.setState({ privacyPolicyEn: e.target.value }) }}
                                                />
                                            </Form.Group>
                                            <Card.Footer style={{paddingRight: "0px", paddingBottom: "0px", paddingTop: "1.25rem"}}>
                                                <div className="d-flex flex-row-reverse">
                                                    <Button variant="info" type="submit">{t("post")}</Button>                            
                                                </div>
                                            </Card.Footer>
                                        </Form>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="gdprClausePl">
                                        <Form noValidate validated={this.state.gdprClausePlFormValidated} onSubmit={this.handleSaveGdprClausePl}>
                                            <Form.Group>                                        
                                                <Form.Control
                                                    rows="20"                                            
                                                    as="textarea"
                                                    name="gdprClausePl"
                                                    value={this.state.gdprClausePl}
                                                    onChange={(e) => { this.setState({ gdprClausePl: e.target.value }) }}
                                                />
                                            </Form.Group>
                                            <Card.Footer style={{paddingRight: "0px", paddingBottom: "0px", paddingTop: "1.25rem"}}>
                                                <div className="d-flex flex-row-reverse">
                                                    <Button variant="info" type="submit">{t("post")}</Button>                            
                                                </div>
                                            </Card.Footer>
                                        </Form>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="gdprClauseEn">
                                        <Form noValidate validated={this.state.gdprClauseEnFormValidated} onSubmit={this.handleSaveGdprClauseEn}>
                                            <Form.Group>                                        
                                                <Form.Control
                                                    rows="20"                                            
                                                    as="textarea"
                                                    name="gdprClauseEn"
                                                    value={this.state.gdprClauseEn}
                                                    onChange={(e) => { this.setState({ gdprClauseEn: e.target.value }) }}
                                                />
                                            </Form.Group>
                                            <Card.Footer style={{paddingRight: "0px", paddingBottom: "0px", paddingTop: "1.25rem"}}>
                                                <div className="d-flex flex-row-reverse">
                                                    <Button variant="info" type="submit">{t("post")}</Button>                            
                                                </div>
                                            </Card.Footer>
                                        </Form>
                                    </Tab.Pane>
                                </Tab.Content>
                                </Col>
                            </Row>
                            </Tab.Container>
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

export default withTranslation('translation', { withRef: true })(FormalRulesSettings);