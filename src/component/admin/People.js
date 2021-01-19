import React, {Component} from "react";
import CrudTableComponent from "../CrudTableComponent";
import {
    Card,
    Form,    
    Col,    
    Button
} from "react-bootstrap";
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import AuthService from "../../service/auth-service";
import * as Urls from "../../servers-urls";


const USERS_URL = Urls.WEBSERVICE_URL + "/users";

const columns = [
    {
        dataField: "id",
        sort: false,
        hidden: true
    },
    {
        dataField: "fullName",
        text: "Full name",
        sort: true, 
        filter: textFilter()           
    },
    {
        dataField: "email", 
        text: "Email",
        sort: false,        
        filter: textFilter(),                       
    },
    {            
        dataField: "country",
        text: "Country",
        sort: true,
        filter: textFilter(),
    },
    {            
        dataField: "club.clubName",
        text: "Club",
        sort: true,
        filter: textFilter(),
    }
];


class People extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const currentUser = AuthService.getCurrentUser();
        this.props.navbarControlsHandler();

        return(
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <Card>
                    <Card.Body>
                        <Card.Text>
                            <CrudTableComponent itemsUrl={USERS_URL} tableColumns={columns} />             
                        </Card.Text>
                    </Card.Body>
                </Card>
            ) :
            ( <h2>You do not have priviledges  granted to view this section.</h2> )
        );
    }
}

export default People;