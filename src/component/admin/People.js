import React, {Component} from "react";
import CrudTableComponent from "../CrudTableComponent";
import {
    Card,
    Form,    
    Col,    
    Button
} from "react-bootstrap";
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { withTranslation } from "react-i18next";
import AuthService from "../../service/auth-service";
import * as Urls from "../../servers-urls";


const USERS_URL = Urls.WEBSERVICE_URL + "/users";

const Columns = Object.freeze ({
    ID: 0,
    FULL_NAME: 1,
    EMAIL: 2,
    COUNTRY: 3,
    CLUB: 4,
});

const searchableHeaderFormatter = (column, colIndex, { sortElement, filterElement }) => {
    return (
        <div style={ { display: 'flex', flexDirection: 'column' } }>            
            { column.text }            
            { filterElement }
            { sortElement }
        </div>
    );
};

const columns = [
    {
        dataField: "id",
        sort: false,
        hidden: true
    },
    {
        dataField: "fullName",
        text: "",
        sort: true, 
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter,
    },
    {
        dataField: "email", 
        text: "",
        sort: false,        
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter,                     
    },
    {            
        dataField: "country",
        text: "",
        sort: true,
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter,
    },
    {            
        dataField: "club.clubName",
        text: "",
        sort: true,
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter,
    }
];


class People extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            selectedRowsIds: []
        }
        

        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);

        this.crudTableRef = React.createRef();
    }

    handleRowClick(selectedRowId)
    {
        this.setState({ selectedRowsIds: selectedRowId });
    }

    handleRowSelection(selectedRows)
    {
        this.setState({ selectedRowsIds: selectedRows });
    }

    render()
    {
        const currentUser = AuthService.getCurrentUser();
        const t = this.props.t;

        columns[Columns.FULL_NAME] = {...columns[Columns.FULL_NAME], text: t("full_name"), filter: textFilter({ placeholder: t("enter_full_name")})};
        columns[Columns.EMAIL] = {...columns[Columns.EMAIL], text: t("email"), filter: textFilter({ placeholder: t("enter_email")})};
        columns[Columns.COUNTRY] = {...columns[Columns.COUNTRY], text: t("country"), filter: textFilter({ placeholder: t("enter_country")})};
        columns[Columns.CLUB] = {...columns[Columns.CLUB], text: t("club"), filter: textFilter({ placeholder: t("enter_club")})};
        
        this.props.navbarControlsHandler();        

        return(
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <Card>
                    <Card.Body>
                        <Card.Text>
                            <CrudTableComponent itemsUrl={USERS_URL} 
                                                tableColumns={columns} 
                                                selectedItemId={this.handleRowClick} 
                                                selectedIds={this.handleRowSelection}
                                                ref={this.crudTableRef}
                            />             
                        </Card.Text>
                    </Card.Body>
                </Card>
            ) :
            ( <h2>You do not have priviledges  granted to view this section.</h2> )
        );
    }
}

export default withTranslation()(People);