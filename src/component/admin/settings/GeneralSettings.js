import React, { Component } from "react";
import {
    Alert,
    Card,   
    Row,
    Col,
    Form,
    Button,   
    OverlayTrigger,
    Tooltip
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import InformationDialogModal from "../../InformationDialogModal";
import ConfirmationDialogModal from "../../ConfirmationDialogModal";
import AuthService from "../../../service/auth-service";
import * as SettingsConstants from "./settingsConstants";
import { handleFetchErrors } from "../../../utils/handleFetchErrors";
import { getGeneralSettings } from "./getGeneralSettings";
import * as Urls from "../../../servers-urls";
import Dropzone from "../Dropzone";
import {AiOutlineRetweet} from "react-icons/ai";


const currentUser = AuthService.getCurrentUser();


class GeneralSettings extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { 
            showInformationModal: false,
            showRestoreDefaultClubLogoConfirmationModal: false,
            clubLogoPath: "",
            clubName: "",
            contactEmail: "",
            facebookUrl: "",
            youtubeUrl: "",
            instagramUrl: "",
            clubNameFormValidated: false,
            contactEmailFormValidated: false,
            facebookFormValidated: false,
            youtubeFormValidated: false,
            instagramFormValidated: false,            
            errorMessage: "",
            popupErrorMessage: "", 
        }
                 
        this.handleUpdateProperty = this.handleUpdateProperty.bind(this);
        this.handleUpdateClubName = this.handleUpdateClubName.bind(this);
        this.handleUpdateContactEmail = this.handleUpdateContactEmail.bind(this);
        this.handleUpdateFacebookUrl = this.handleUpdateFacebookUrl.bind(this);
        this.handleUpdateYoutubeUrl = this.handleUpdateYoutubeUrl.bind(this);
        this.handleUpdateInstagramUrl = this.handleUpdateInstagramUrl.bind(this);
        this.onDropClubLogo = this.onDropClubLogo.bind(this);
        this.restoreDefaultClubLogo = this.restoreDefaultClubLogo.bind(this);
    }

    componentDidMount()
    {
        const t = this.props.t;
        
        getGeneralSettings(currentUser)
        .then(data => {
            this.setState({
                clubLogoPath: data[SettingsConstants.PropertyNames.CLUB_LOGO_PATH].value,
                clubName: data[SettingsConstants.PropertyNames.CLUB_NAME].value,
                contactEmail: data[SettingsConstants.PropertyNames.CONTACT_EMAIL].value,
                facebookUrl: data[SettingsConstants.PropertyNames.FACEBOOK_URL].value,
                youtubeUrl: data[SettingsConstants.PropertyNames.YOUTUBE_URL].value,
                instagramUrl: data[SettingsConstants.PropertyNames.INSTAGRAM_URL].value                
            });
        })
        .catch(error => this.setState({ errorMessage: t("failed_to_fetch") }));
    }

    handleUpdateProperty(key, value)
    {
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
                            popupErrorMessage: "Data has been saved successfully.",
                            showInformationModal: true,
                            clubNameFormValidated: false,
                            contactEmailFormValidated: false
         }) )
        .catch(() => this.setState({ errorMessage: "Error: Data cannot be saved." })  )
    }

    handleUpdateClubName(e)
    {
        e.preventDefault();        
        
        if ( e.currentTarget.checkValidity() ) 
            this.handleUpdateProperty("club_name", this.state.clubName); 
        else this.setState({ clubNameFormValidated: true });
    }

    handleUpdateContactEmail(e)
    {
        e.preventDefault();        
        
        if ( e.currentTarget.checkValidity() ) 
            this.handleUpdateProperty("contact_email", this.state.contactEmail); 
        else this.setState({ contactEmailFormValidated: true });
    }

    handleUpdateFacebookUrl(e)
    {
        e.preventDefault();

        if ( e.currentTarget.checkValidity() )
            this.handleUpdateProperty("facebook_url", this.state.facebookUrl);
        else this.setState({ facebookFormValidated: true });
    }

    handleUpdateYoutubeUrl(e)
    {
        e.preventDefault();

        if ( e.currentTarget.checkValidity() )
            this.handleUpdateProperty("youtube_url", this.state.youtubeUrl);
        else this.setState({ youtubeFormValidated: true });        
    }

    handleUpdateInstagramUrl(e)
    {
        e.preventDefault();

        if ( e.currentTarget.checkValidity() )
            this.handleUpdateProperty("instagram_url", this.state.instagramUrl);
        else this.setState({ instagramFormValidated: true });        
    }

    onDropClubLogo(acceptedFiles)
    {        
        if ( acceptedFiles.length == 0 )
            return;

        this.setState({
            clubLogoPicture: {
                file: acceptedFiles[0],
                name: acceptedFiles[0].name
            }
        }, 
        () => {            
            let imageTargetDir = "/images/settings/club_logo";
            let formData = new FormData();
            formData.append("logoImage", this.state.clubLogoPicture.file);            
            formData.append("clubLogoTargetDir", imageTargetDir);

            fetch(Urls.EXPRESS_JS_URL + "/save_club_logo", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + currentUser.accessToken
                },
                body: formData
            })
            .then(response => {
                if ( response.ok ) {
                    this.handleUpdateProperty("club_logo_path", imageTargetDir + "/" + this.state.clubLogoPicture.name );
                    window.location.reload();
                }
                    
                else throw Error("Cannot save a logo image. Server do not respond.");
            })            
            .catch(error => {                
                this.setState({ 
                    popupErrorMessage: error.message,
                    showInformationModal: true
                });
            });
        });
    }

    restoreDefaultClubLogo(confirmed)
    {
        if ( !confirmed ) return;

        let imageTargetDir = "/images/settings/club_logo";
        let formData = new FormData();        
        formData.append("dir", imageTargetDir);

        fetch(Urls.EXPRESS_JS_URL + "/clear_dir", {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            },
            body: formData
        })
        .then(response => {
            if ( response.ok ) {
                this.handleUpdateProperty("club_logo_path", "/default_club_logo/default-ma-club-event-manager-logo.jpg");
                window.location.reload();
            }
                
            else throw Error("Cannot save a logo image. Server do not respond.");
        })            
        .catch(error => {                
            this.setState({ 
                popupErrorMessage: error.message,
                showInformationModal: true
            });
        });
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
                     <ConfirmationDialogModal   show={this.state.showRestoreDefaultClubLogoConfirmationModal}
                                                onHide={() => this.setState({ showRestoreDefaultClubLogoConfirmationModal: false }) }
                                                confirmationResult={this.restoreDefaultClubLogo}                                                
                    />
                    <Card>                                
                        <Card.Body>
                            {this.state.errorMessage && (<Alert variant="danger">{this.state.errorMessage}</Alert>)}                           
                            <Col>
                                <Row>
                                    <Card>
                                        <Card.Header>                                            
                                            {t("logo_capital")}
                                            <OverlayTrigger  placement="bottom" overlay={<Tooltip>{t("restore_default")}</Tooltip>} >
                                                <Link style={{float: "right"}} onClick={() => this.setState({ showRestoreDefaultClubLogoConfirmationModal: true })} >									
                                                    <AiOutlineRetweet color="gray" size={23} style={{marginLeft: "10px"}} />
                                                </Link>
                                            </OverlayTrigger>
                                        </Card.Header>
                                        <Card.Body>                                            
                                            <Dropzone   onDrop={this.onDropClubLogo} 
                                                        accept={"image/*"}
                                                        imagePath={this.state.clubLogoPath ? this.state.clubLogoPath : ""}
                                                        mw="200px"
                                                        mh="112px"
                                            /> 
                                        </Card.Body>
                                    </Card>
                                    <div style={{padding: "0.625rem"}}></div>
                                    <Card style={{flex: "auto"}}>
                                        <Card.Header>{t("club_name_capital")}</Card.Header>
                                        <Card.Body>
                                            <Form noValidate validated={this.state.clubNameFormValidated} onSubmit={this.handleUpdateClubName}> 
                                                <Form.Row>                                                            
                                                    <Form.Control style={{resize: "none"}} required                                                            
                                                        rows="2"
                                                        as="textarea"                                            
                                                        name="clubName"
                                                        value={this.state.clubName}
                                                        onChange={(e) => { this.setState({ clubName: e.target.value }) }}
                                                    />
                                                    <Form.Control.Feedback>{t("looks_good")}</Form.Control.Feedback>
                                                    <Form.Control.Feedback type="invalid">{t("provide_valid_value")}</Form.Control.Feedback>                                                           
                                                </Form.Row> 
                                                <Form.Row className="d-flex flex-row-reverse" style={{paddingTop: "0.625rem"}}>                                                            
                                                    <Button variant="info" type="submit">{t("post")}</Button>
                                                </Form.Row>
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </Row>
                                <div style={{padding: "0.625rem"}}></div>
                                <Row>
                                    <Card style={{flex: "auto"}}>
                                        <Card.Header>{t("contact_email_capital")}</Card.Header>
                                        <Card.Body>
                                            <Form noValidate validated={this.state.contactEmailFormValidated} onSubmit={this.handleUpdateContactEmail}> 
                                                <Form.Row >
                                                    <Form.Group  style={{flex: "auto"}}>
                                                        <Form.Control  required                                                                
                                                            name="contactEmail"
                                                            value={this.state.contactEmail}
                                                            onChange={(e) => { this.setState({ contactEmail: e.target.value }) }}
                                                        />
                                                        <Form.Control.Feedback>{t("looks_good")}</Form.Control.Feedback>
                                                        <Form.Control.Feedback type="invalid">{t("provide_valid_value")}</Form.Control.Feedback>                                                           
                                                    </Form.Group>                                                            
                                                    <Form.Group style={{paddingLeft: "0.625rem"}}>
                                                        <Button variant="info" type="submit">{t("post")}</Button>
                                                    </Form.Group>
                                                </Form.Row>                                                         
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </Row>
                                <div style={{padding: "0.625rem"}}></div>
                                <Row>
                                    <Card style={{flex: "auto"}}>
                                        <Card.Header>{t("social_media_capital")}</Card.Header>
                                        <Card.Body>
                                            <Form noValidate validated={this.state.facebookFormValidated} onSubmit={this.handleUpdateFacebookUrl}> 
                                                <Form.Row >
                                                    <Form.Group>
                                                        <Form.Label style={{width: "6rem"}}>Facebook</Form.Label>
                                                    </Form.Group>
                                                    <Form.Group style={{flex: "auto"}}>
                                                        <Form.Control  required                                                                
                                                            name="facebookUrl"
                                                            value={this.state.facebookUrl}
                                                            onChange={(e) => { this.setState({ facebookUrl: e.target.value }) }}
                                                        />
                                                        <Form.Control.Feedback>{t("looks_good")}</Form.Control.Feedback>
                                                        <Form.Control.Feedback type="invalid">{t("provide_valid_value")}</Form.Control.Feedback>                                                           
                                                    </Form.Group>                                                            
                                                    <Form.Group style={{paddingLeft: "0.625rem"}}>
                                                        <Button variant="info" type="submit">{t("post")}</Button>
                                                    </Form.Group>
                                                </Form.Row>                                                         
                                            </Form>
                                            <Form noValidate validated={this.state.youtubeFormValidated} onSubmit={this.handleUpdateYoutubeUrl}> 
                                                <Form.Row >
                                                    <Form.Group>
                                                        <Form.Label style={{width: "6rem"}}>Youtube</Form.Label>
                                                    </Form.Group>
                                                    <Form.Group  style={{flex: "auto"}}>
                                                        <Form.Control  required                                                                
                                                            name="youtubeUrl"
                                                            value={this.state.youtubeUrl}
                                                            onChange={(e) => { this.setState({ youtubeUrl: e.target.value }) }}
                                                        />
                                                        <Form.Control.Feedback>{t("looks_good")}</Form.Control.Feedback>
                                                        <Form.Control.Feedback type="invalid">{t("provide_valid_value")}</Form.Control.Feedback>                                                           
                                                    </Form.Group>                                                            
                                                    <Form.Group style={{paddingLeft: "0.625rem"}}>
                                                        <Button variant="info" type="submit">{t("post")}</Button>
                                                    </Form.Group>
                                                </Form.Row>                                                         
                                            </Form>
                                            <Form noValidate validated={this.state.instagramFormValidated} onSubmit={this.handleUpdateInstagramUrl}> 
                                                <Form.Row >
                                                    <Form.Group>
                                                        <Form.Label style={{width: "6rem"}}>Instagram</Form.Label>
                                                    </Form.Group>
                                                    <Form.Group  style={{flex: "auto"}}>
                                                        <Form.Control  required                                                                
                                                            name="instagramUrl"
                                                            value={this.state.instagramUrl}
                                                            onChange={(e) => { this.setState({ instagramUrl: e.target.value }) }}
                                                        />
                                                        <Form.Control.Feedback>{t("looks_good")}</Form.Control.Feedback>
                                                        <Form.Control.Feedback type="invalid">{t("provide_valid_value")}</Form.Control.Feedback>                                                           
                                                    </Form.Group>                                                            
                                                    <Form.Group style={{paddingLeft: "0.625rem"}}>
                                                        <Button variant="info" type="submit">{t("post")}</Button>
                                                    </Form.Group>
                                                </Form.Row>                                                         
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </Row>                                            
                            </Col>
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

export default withTranslation('translation', { withRef: true })(GeneralSettings);