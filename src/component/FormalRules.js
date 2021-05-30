import React, { Component } from "react";
import {    
    Form,     
    Tab,
    Nav,
    Row,
    Col
} from "react-bootstrap";
import { withTranslation } from "react-i18next";
import * as SettingsConstants from "./admin/settings/settingsConstants";
import { handleFetchErrors, handleMultipleFetchErrors } from "../utils/handleFetchErrors";
import { fetchMetadataForGet } from "../utils/fetchMetadata";


class FormalRules extends Component
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
            errorMessage: ""
        }
    }

    componentDidMount()
    {
        const t = this.props.t;

        let formalRulesRequests = [];
        formalRulesRequests.push( fetch(SettingsConstants.TERMS_AND_CONDITIONS_PL, fetchMetadataForGet(null)) );
        formalRulesRequests.push( fetch(SettingsConstants.TERMS_AND_CONDITIONS_EN, fetchMetadataForGet(null)) );
        formalRulesRequests.push( fetch(SettingsConstants.PRIVACY_POLICY_PL, fetchMetadataForGet(null)) );
        formalRulesRequests.push( fetch(SettingsConstants.PRIVACY_POLICY_EN, fetchMetadataForGet(null)) );
        formalRulesRequests.push( fetch(SettingsConstants.GDPR_CLAUSE_PL, fetchMetadataForGet(null)) );
        formalRulesRequests.push( fetch(SettingsConstants.GDPR_CLAUSE_EN, fetchMetadataForGet(null)) );

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

    render()
    {
        this.props.navbarControlsHandler();
        const t = this.props.t;

        return (          
            <Tab.Container id="left-tabs-example" defaultActiveKey="termsAndConditionsPl">
                <Row>
                    <Col sm={2}>
                        <Nav variant="pills" className="flex-column formal-rules">
                            {this.state.termsAndConditionsPl && (
                                <Nav.Item><Nav.Link eventKey="termsAndConditionsPl">{t("termsAndConditionsPl")}</Nav.Link></Nav.Item>
                            )}
                            {this.state.termsAndConditionsEn && (
                                <Nav.Item><Nav.Link eventKey="termsAndConditionsEn">{t("termsAndConditionsEn")}</Nav.Link></Nav.Item>
                            )}
                            {this.state.privacyPolicyPl && (
                                <Nav.Item><Nav.Link eventKey="privacyPolicyContentPl">{t("privacyPolicyContentPl")}</Nav.Link></Nav.Item>
                            )}
                            {this.state.privacyPolicyEn && (
                                <Nav.Item><Nav.Link eventKey="privacyPolicyContentEn">{t("privacyPolicyContentEn")}</Nav.Link></Nav.Item>
                            )}
                            {this.state.gdprClausePl && (
                                <Nav.Item><Nav.Link eventKey="gdprClausePl">{t("gdprClausePl")}</Nav.Link></Nav.Item>
                            )}
                            {this.state.gdprClauseEn && (
                                <Nav.Item><Nav.Link eventKey="gdprClauseEn">{t("gdprClauseEn")}</Nav.Link></Nav.Item>
                            )}                            
                        </Nav>
                    </Col>
                    <Col sm={10}>
                        <Tab.Content>
                            <Tab.Pane eventKey="termsAndConditionsPl">
                                <Form.Control
                                    rows="20"                                            
                                    as="textarea"
                                    name="termsAndConditionsPl"
                                    value={this.state.termsAndConditionsPl}                                                    
                                />
                            </Tab.Pane>
                            <Tab.Pane eventKey="termsAndConditionsEn">
                                <Form.Control
                                    rows="20"                                            
                                    as="textarea"
                                    name="termsAndConditionsEn"
                                    value={this.state.termsAndConditionsEn}
                                    
                                />                                            
                            </Tab.Pane>
                            <Tab.Pane eventKey="privacyPolicyContentPl">                                                                                  
                                <Form.Control
                                    rows="20"                                            
                                    as="textarea"
                                    name="privacyPolicyContentPl"
                                    value={this.state.privacyPolicyPl}                                            
                                />                                            
                            </Tab.Pane>
                            <Tab.Pane eventKey="privacyPolicyContentEn">                                                                             
                                <Form.Control
                                    rows="20"                                            
                                    as="textarea"
                                    name="privacyPolicyContentEn"
                                    value={this.state.privacyPolicyEn}                                            
                                />                                            
                            </Tab.Pane>
                            <Tab.Pane eventKey="gdprClausePl">
                                <Form.Control
                                    rows="20"                                            
                                    as="textarea"
                                    name="gdprClausePl"
                                    value={this.state.gdprClausePl}                                            
                                />                                            
                            </Tab.Pane>
                            <Tab.Pane eventKey="gdprClauseEn">                                                                               
                                <Form.Control
                                    rows="20"                                            
                                    as="textarea"
                                    name="gdprClauseEn"
                                    value={this.state.gdprClauseEn}                                            
                                />                                            
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>           
        );
    }
}

export default withTranslation('translation', { withRef: true })(FormalRules);
