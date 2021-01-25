import React, {Component} from "react";
import {
    Table, 
    Card
} from "react-bootstrap";
import AuthService from "../service/auth-service";
import * as Urls from "../servers-urls";


const CLUB_DOCUMENTS_API_URL = Urls.WEBSERVICE_URL + "/club_documents";


class Downloads extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            clubDocuments: []
        };
    }

    componentDidMount()
    {
        fetch(CLUB_DOCUMENTS_API_URL)
        .then(response => response.json())
        .then(data => {
            this.setState({ clubDocuments: data })
        });
    }

    render()
    {
        const currentUser = AuthService.getCurrentUser();
        this.props.navbarControlsHandler();

        return(
            currentUser != null ?
            ( 
                <div>                    
                    <Table striped bordered >
                        <tbody>
                            {this.state.clubDocuments.map(clubDocument => {
                                return(
                                    <tr>
                                        <td>{clubDocument.clubDocumentDescription}</td>
                                        <td>
                                            <a href={clubDocument.clubDocumentPath}>Download</a>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>                    
                </div>
            ) :
            ( <h2>You do not have priviledges  granted to view this section.</h2> )
        );
    }
}

export default Downloads;