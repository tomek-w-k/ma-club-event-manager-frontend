import React, { Component } from "react";
import {
    Card,
    Form,
    Button,
    Alert
} from "react-bootstrap";
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();

const BRANCH_CHIEFS_SELECTABLE_OPTION = "branchChiefs";
const CLUBS_SELECTABLE_OPTION = "clubs";
const RANKS_SELECTABLE_OPTION = "ranks";
const BRANCH_CHIEFS_URL = Urls.WEBSERVICE_URL + "/branch_chiefs";
const CLUBS_URL = Urls.WEBSERVICE_URL + "/clubs";
const RANKS_URL = Urls.WEBSERVICE_URL + "/ranks";


class AddSelectableUserOption extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            errorMessage: null,
            formValidated: false,
            selectableOption: {
                optionName: ""
            }
        }
        
        this.renderOptionNameLabel = this.renderOptionNameLabel.bind(this);
        this.getSelectableOptionEndpointUrl = this.getSelectableOptionEndpointUrl.bind(this);
        this.getSelectableOptionJson = this.getSelectableOptionJson.bind(this);
        this.handleAddSelectableUserOption = this.handleAddSelectableUserOption.bind(this);
    }
 
    renderOptionNameLabel(option)
    {
        const t = this.props.t;
        
        switch(option)
        {
            case BRANCH_CHIEFS_SELECTABLE_OPTION: return <Form.Label>{t("full_name")}</Form.Label>;
            case CLUBS_SELECTABLE_OPTION: return <Form.Label>{t("club")}</Form.Label>;
            case RANKS_SELECTABLE_OPTION: return <Form.Label>{t("rank")}</Form.Label>;
        }
    }

    getSelectableOptionEndpointUrl()
    {
        switch ( localStorage.getItem("settingsSelectedTab") )
        {
            case BRANCH_CHIEFS_SELECTABLE_OPTION: return BRANCH_CHIEFS_URL;
            case CLUBS_SELECTABLE_OPTION: return CLUBS_URL;
            case RANKS_SELECTABLE_OPTION: return RANKS_URL;
        }
    }
    
    getSelectableOptionJson()
    {
        switch ( localStorage.getItem("settingsSelectedTab") )
        {
            case BRANCH_CHIEFS_SELECTABLE_OPTION: return JSON.stringify( {branchChiefName: this.state.selectableOption.optionName} );
            case CLUBS_SELECTABLE_OPTION: return JSON.stringify( {clubName: this.state.selectableOption.optionName} );
            case RANKS_SELECTABLE_OPTION: return JSON.stringify( {rankName: this.state.selectableOption.optionName} );
        }
    }

    handleAddSelectableUserOption(e)
    {
        e.preventDefault();

        if ( e.currentTarget.checkValidity() )        
        {
            this.setState({ formValidated: true });
            
            fetch(this.getSelectableOptionEndpointUrl(), {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + currentUser.accessToken
                },
                body: this.getSelectableOptionJson()            
            })        
            .then(result => {
                if ( result.ok ) {
                    this.props.history.push("/settings_component");
                    window.location.reload();
                } 
                else return result.json();
            },            
            // error => { this.setState({ errorMessage: error.message }) })
            error => { 
                //this.setState({ errorMessage: error.message }) 
                console.log(error);
            })
            .then( result => {                 
                if ( result )
                    this.setState({ errorMessage: result.message }); 
            });
        }
        else this.setState({ formValidated: true });
    }

    render()
    {
        const t = this.props.t;
        this.props.navbarControlsHandler();

        return (
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <div>                    
                    {this.state.errorMessage && (<Alert variant="danger">{this.state.errorMessage}</Alert>)}
                    <Card>
                        <Card.Body>
                            <Card.Text>                            
                                <Form noValidate validated={this.state.formValidated} onSubmit={this.handleAddSelectableUserOption}>                            
                                    <Form.Group>
                                        {this.renderOptionNameLabel(localStorage.getItem("settingsSelectedTab"))}
                                        <Form.Control required                                            
                                            name="optionName"
                                            value={this.state.selectableOption.optionName}
                                            onChange={(e) => { this.setState({ selectableOption: {...this.state.selectableOption, optionName: e.target.value} }) }}
                                        />
                                    </Form.Group>
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
                    <Alert.Heading>{t("access_denided")}</Alert.Heading>
                    <p>{t("no_priviledges")}</p>
                </Alert> 
            )
        );
    }
}

export default withTranslation('translation', { withRef: true })(AddSelectableUserOption);