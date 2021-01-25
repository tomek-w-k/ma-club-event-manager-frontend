import React, {Component} from "react";
import {
    Card,
    Form,    
    Col,   
    Row, 
    Button,
    Alert,
} from "react-bootstrap";
import ClubDocumentDropzone from "./ClubDocumentDropzone";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const CLUB_DOCUMENTS_API_URL = Urls.WEBSERVICE_URL + "/club_documents";


class AddClubDocument extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            clubDocument: {
                id: null,
                clubDocumentDescription: "",
                clubDocumentPath: ""
            },
            errorMessage: null,
            formValidated: false,
            clubDocumentTemp: ""
        }

        this.handleAddClubDocument = this.handleAddClubDocument.bind(this);
        this.onDropClubDocument = this.onDropClubDocument.bind(this);

    }

    handleAddClubDocument(e)
    {
        e.preventDefault();
        if ( e.currentTarget.checkValidity() )
        {            
            this.setState({ formValidated: true });

            fetch(CLUB_DOCUMENTS_API_URL,{
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify( this.state.clubDocument )            
            })        
            .then(result => result.json())
            .then(result => {                
                let clubDocumentTargetDir = "/club_documents/" + result.id;
                let formData = new FormData();
                formData.append("clubDocument", this.state.clubDocumentTemp.file);
                formData.append("clubDocumentTargetDir", clubDocumentTargetDir);

                fetch(Urls.EXPRESS_JS_URL + "/save_club_document", {
                    method: "POST",
                    body: formData
                })
                .then(response => response.json())
                .then(response => {
                    let clubDocumentUrl = Urls.EXPRESS_JS_URL + "/get_club_document/" + result.id + "/" + response.clubDocumentName;
                    let clubDocument = {...result, clubDocumentPath: clubDocumentUrl};

                    fetch(CLUB_DOCUMENTS_API_URL, {
                        method: "PUT",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify( clubDocument )
                    })
                    .then(() => {
                        this.props.history.push("/club_documents_component"); 
                    });          
                });         
            },
            error => { this.setState({ errorMessage: "Error: Document not saved" }) })            
        }
        else this.setState({ 
            formValidated: true,
            errorMessage: "Please fill all required fields."
        });
    }

    onDropClubDocument(acceptedFiles)
    {        
        let clubDocument = {
            file: acceptedFiles[0],
            name: acceptedFiles[0].name
        };
        
        this.setState({ clubDocumentTemp: clubDocument }, () => console.log(this.state.clubDocumentTemp));
    }

    render()
    {
        const currentUser = AuthService.getCurrentUser();        
        this.props.navbarControlsHandler();

        return(
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            ( 
                <div>
                    {this.state.errorMessage && (<Alert variant="danger">{this.state.errorMessage}</Alert>)}
                    <Card>
                        <Card.Body>
                            <Card.Text>                            
                                <Form noValidate validated={this.state.formValidated} onSubmit={this.handleAddClubDocument}>                            
                                    <Form.Group>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control required
                                            as="textarea"
                                            name="clubDocumentDescription"
                                            value={this.state.clubDocument.clubDocumentDescription}
                                            onChange={(e) => { this.setState({ clubDocument: {...this.state.clubDocument, clubDocumentDescription: e.target.value} }) }}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Card>
                                            <ClubDocumentDropzone   onDrop={this.onDropClubDocument} 
                                                                    //accept={} 
                                                                    fileName={ this.state.clubDocumentTemp ? this.state.clubDocumentTemp.name : "" }                                                        
                                            />
                                        </Card>
                                    </Form.Group>
                                    <Form.Group>                                        
                                        <Form.Control hidden
                                            type="text"
                                            name="clubDocumentPath"
                                            value={this.state.clubDocument.clubDocumentPath}
                                            onChange={(e) => { this.setState({ clubDocument: {...this.state.clubDocument, clubDocumentPath: e.target.value} }) }}
                                        />
                                    </Form.Group>
                                    <br />
                                    <Card.Footer style={{paddingRight: "0px", paddingBottom: "0px", paddingTop: "1.25rem"}}>
                                        <div className="d-flex flex-row-reverse"> 
                                            <Button variant="info" type="submit">Post</Button>                            
                                        </div>
                                    </Card.Footer>
                                </Form>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            ) :
            ( <h2>You do not have priviledges  granted to view this section.</h2> )
        );
    }
}

export default AddClubDocument;