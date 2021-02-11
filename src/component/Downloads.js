import React, {Component} from "react";
import {
    Table, 
    Alert,
    OverlayTrigger,
    Tooltip,    
} from "react-bootstrap";
import {Link} from "react-router-dom";
import { withTranslation } from "react-i18next";
import {AiOutlineDownload} from "react-icons/ai";
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
        const t = this.props.t;
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
                                            {/* <a href={clubDocument.clubDocumentPath}>{t("download")}</a> */}
                                            <OverlayTrigger placement="bottom" overlay={<Tooltip>{t("download")}</Tooltip>} >
                                                <a href={clubDocument.clubDocumentPath}>
                                                    <AiOutlineDownload color="gray" size={30} style={{marginLeft: "10px"}} />
                                                </a>
                                                {/* <Link to={clubDocument.clubDocumentPath} >									
                                                    <AiOutlineDownload color="gray" size={30} style={{marginLeft: "10px"}} />
                                                </Link> */}
                                            </OverlayTrigger>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>                    
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

export default withTranslation()(Downloads);