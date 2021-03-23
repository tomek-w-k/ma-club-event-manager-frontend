import React, { Component } from "react";
import {
    Alert,    
    Form,
    Modal,
    Button
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
var optionName = "";


class EditSelectableUserOptionModal extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            errorMessage: "",
            formValidated: false,
            selectableOption: {
                id: null,
                optionName: ""
            }
        }

        this.renderOptionNameLabel = this.renderOptionNameLabel.bind(this);
        this.getSelectableOptionEndpointUrl = this.getSelectableOptionEndpointUrl.bind(this);
        this.writeSelectableOptionDataToState = this.writeSelectableOptionDataToState.bind(this);
        this.getSelectableOptionJson = this.getSelectableOptionJson.bind(this);
        this.loadItemToUpdate = this.loadItemToUpdate.bind(this);
        this.handleUpdateSelectableUserOption = this.handleUpdateSelectableUserOption.bind(this);
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

    writeSelectableOptionDataToState(data)
    {
        switch ( localStorage.getItem("settingsSelectedTab") )
        {
            case BRANCH_CHIEFS_SELECTABLE_OPTION: {
                optionName = data.branchChiefName;
                this.setState({ selectableOption: { id: data.id, optionName: data.branchChiefName } });
                break;
            } 
            case CLUBS_SELECTABLE_OPTION: {
                optionName = data.clubName;
                this.setState({ selectableOption: { id: data.id, optionName: data.clubName } });
                break;
            }
            case RANKS_SELECTABLE_OPTION: {
                optionName = data.rankName
                this.setState({ selectableOption: { id: data.id, optionName: data.rankName } }); 
                break;
            }
        }        
    }

    getSelectableOptionJson()
    {
        switch ( localStorage.getItem("settingsSelectedTab") )
        {
            case BRANCH_CHIEFS_SELECTABLE_OPTION: return JSON.stringify( {
                                                                id: this.state.selectableOption.id, 
                                                                branchChiefName: this.state.selectableOption.optionName
                                                            } );
            case CLUBS_SELECTABLE_OPTION: return JSON.stringify( {
                                                                id: this.state.selectableOption.id, 
                                                                clubName: this.state.selectableOption.optionName
                                                            } );
            case RANKS_SELECTABLE_OPTION: return JSON.stringify( {
                                                                id: this.state.selectableOption.id, 
                                                                rankName: this.state.selectableOption.optionName
                                                            } );
        }
    }

    loadItemToUpdate()
    {
        const t = this.props.t;
        
        this.setState({ 
            errorMessage: "",
            formValidated: false,
            selectableOption: {
                id: null,
                optionName: ""
            }
        });
        
        optionName = "";        

        fetch(this.getSelectableOptionEndpointUrl() + "/" + this.props.itemId, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        })
        .then(response => response.json())
        .then(data => this.writeSelectableOptionDataToState(data), 
            error => this.setState({ errorMessage: t("error_item_cannot_be_loaded") }));        
    }

    handleUpdateSelectableUserOption(e)
    {
        const t = this.props.t;
        
        e.preventDefault();

        if ( e.currentTarget.checkValidity() )        
        {
            this.setState({ formValidated: true });

            fetch(this.getSelectableOptionEndpointUrl(), {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + currentUser.accessToken
                },
                body: this.getSelectableOptionJson()            
            })        
            .then(result => {
                if ( result.ok ) 
                    this.props.onHide();
                else return result.json();
            },
            error => this.setState({ errorMessage: t("error_item_not_updated") }))
            .then( result => {                 
                if ( result )
                    this.setState({ 
                        errorMessage: result.message.replace("branch_chief", t("branch_chief"))
                                                    .replace("club", t("club"))
                                                    .replace("rank", t("rank"))
                                                    .replace("already_exists", t("already_exists"))                                                    
                    }); 
            });
        }
        else this.setState({ formValidated: true });
    }

    render()
    {
        const t = this.props.t; 

        return (
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <Modal 
                    show={this.props.show}                
                    onHide={this.props.onHide}
                    onEnter={this.loadItemToUpdate}
                    animation="true"
                    size="lg"
                    centered="true"                
                >
                    <Form noValidate validated={this.state.formValidated} onSubmit={this.handleUpdateSelectableUserOption}>
                        <Modal.Header>
                            {t("edit_registration")} - {optionName}
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.errorMessage && (<Alert variant="danger">{this.state.errorMessage}</Alert>)}                                                        
                            <Form.Group>
                                {this.renderOptionNameLabel(localStorage.getItem("settingsSelectedTab"))}
                                <Form.Control required                                            
                                    name="optionName"
                                    value={this.state.selectableOption.optionName}
                                    onChange={(e) => { this.setState({ selectableOption: {...this.state.selectableOption, optionName: e.target.value} }) }}
                                />
                                <Form.Control.Feedback>{t("looks_good")}</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">{t("provide_valid_value")}</Form.Control.Feedback>
                            </Form.Group>                      
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

export default withTranslation('translation', { withRef: true })(EditSelectableUserOptionModal);