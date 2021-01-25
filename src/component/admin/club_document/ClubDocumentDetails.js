import React, {Component} from "react";
import {
    Card,
    Form,
    Row,
    Col,    
    Button,    
    Accordion,
    Alert
} from "react-bootstrap";
import ClubDocumentDropzone from "./ClubDocumentDropzone";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const CLUB_DOCUMENTS_API_URL = Urls.WEBSERVICE_URL + "/club_documents";


class ClubDocumentDetails extends Component
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
        };
        this.loadClubDocument = this.loadClubDocument.bind(this);
        this.handleEditClubDocument = this.handleEditClubDocument.bind(this);
        this.onDropClubDocument = this.onDropClubDocument.bind(this);
    }

    loadClubDocument()
    {
        fetch(CLUB_DOCUMENTS_API_URL + "/" + this.props.id)
        .then(response => response.json())
        .then(data => {            
            let getClubDocumentUrl = data.clubDocumentPath ? data.clubDocumentPath : "";

            fetch(getClubDocumentUrl)
            .then(response => response.blob())
            .then(blob => {
                let fileName = data.clubDocumentPath ? data.clubDocumentPath.split('\\').pop().split('/').pop() : "";
                let file = new File([blob], fileName, { lastModified:new Date()});
                return {
                    file: file,
                    name: fileName
                };
            })
            .then(fileWithNameObject => {
                this.setState({ 
                    clubDocument: data,
                    clubDocumentTemp: fileWithNameObject 
                });
            });
        });
    }

    componentDidMount()
    {
        this.loadClubDocument();
    }

    handleEditClubDocument(e)
    {
        e.preventDefault(); 
        if ( e.currentTarget.checkValidity() )
        {
            this.setState({ formValidated: true });
            let clubDocument = {...this.state.clubDocument};

            let clubDocumentTargetDir = "/club_documents/" + clubDocument.id;
            let formData = new FormData();
            formData.append("clubDocument", this.state.clubDocumentTemp.file);
            formData.append("clubDocumentTargetDir", clubDocumentTargetDir);

            fetch(Urls.EXPRESS_JS_URL + "/save_club_document", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(response => {
                //if ( response.ok )
               // {
                    let clubDocumentUrl = Urls.EXPRESS_JS_URL + "/get_club_document/" + clubDocument.id + "/" + response.clubDocumentName;
                    clubDocument = {...clubDocument, clubDocumentPath: clubDocumentUrl};

                    fetch(CLUB_DOCUMENTS_API_URL, {
                        method: "PUT",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify( clubDocument )
                    })                    
                    .then(result => {
                        if ( result.ok ) 
                            this.props.onClubDocumentUpdate();               
                        else return result.json();            
                    },
                    error => { this.setState({ errorMessage: error.message }) })
                    .then( result => { 
                        if ( result )
                            this.setState({ errorMessage: result.message }) ;
                    });
               // }
                //else this.setState({ errorMessage: "Error - document not saved" }) ;
            });
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

        return( 
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            ( 
                <div>
                    {this.state.errorMessage && (<Alert variant="danger">{this.state.errorMessage}</Alert>)}
                    <Accordion defaultActiveKey="0">
                    <Card >
                        {/* style={{backgroundColor: "#EAECEE"}} */}
                        <Card.Header>
                            <div className="d-flex">
                                <div style={{display: "flex", alignItems: "center"}}>DETAILS</div>
                                <Accordion.Toggle className="ml-auto" as={Button} variant="secondary" eventKey="0">Show / Hide</Accordion.Toggle>
                            </div>                        
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <Card.Text>
                                <Form noValidate validated={this.state.formValidated} onSubmit={this.handleEditClubDocument}>   
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
                        </Accordion.Collapse>
                    </Card>
                    </Accordion>
                </div>
            ) :
            ( <h2>You do not have priviledges  granted to view this section.</h2> )
        );
    }
}

export default ClubDocumentDetails;