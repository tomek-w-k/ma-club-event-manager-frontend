import React, {Component} from "react";
import ClubDocumentDetails from "./ClubDocumentDetails";

import AuthService from "../../../service/auth-service";


class ClubDocument extends Component
{
    constructor(props)
    {
        super(props);
        this.goToClubDocuments = this.goToClubDocuments.bind(this); 
    }

    goToClubDocuments()
    {
        this.props.history.push("/club_documents_component");        
    }

    render()
    {
        const currentUser = AuthService.getCurrentUser();
        this.props.navbarControlsHandler();

        return(
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <div>
                    <ClubDocumentDetails id={this.props.match.params.id} onClubDocumentUpdate={this.goToClubDocuments} />                    
                </div>
            ): (<h2>You do not have priviledges  granted to view this section.</h2 > )
        )
    }
}

export default ClubDocument;