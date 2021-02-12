import React, {Component} from "react";
import CrudTableComponent from "../../CrudTableComponent";
import {
    Card,
    Alert
} from "react-bootstrap";
import {textFilter} from 'react-bootstrap-table2-filter';
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();
const TOURNAMENT_EVENTS_URL = Urls.WEBSERVICE_URL + "/tournament_events";
const EVENTS_API_URL = Urls.WEBSERVICE_URL + "/events";

const Columns = Object.freeze ({
    ID: 0,
    TOURNAMENT_NAME: 1,
    START_DATE: 2,
    TEAMS_SIGNED_IN: 3,    
});

const headerFormatter = (column, colIndex, { sortElement, filterElement }) => {
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
        dataField: "eventName",
        text: "Event name",
        sort: true, 
        filter: textFilter(),
        headerFormatter: headerFormatter,
        style: (colum, colIndex) => {
            return { width: '60%', textAlign: 'left' };
        },           
    },
    {
        dataField: "startDate", 
        text: "Start date",
        sort: true,
        type: "date",
        style: (colum, colIndex) => {
            return { width: '20%', textAlign: 'center' };
        }, 
        headerStyle:  { "text-align": "center" },
        filter: textFilter(),
        headerFormatter: headerFormatter,                       
    },
    {            
        dataField: "teams.length",        
        text: "Persons signed in",
        sort: false,
        style: (colum, colIndex) => {
            return { width: '20%', textAlign: 'center' };
        },
        headerStyle:  { "text-align": "center" },
        filter: textFilter({            
            disabled: "true",
            placeholder: "-"
        }),
        headerFormatter: headerFormatter
    }          
];


class Tournaments extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            selectedRowsIds: null
        }
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.handleDeleteTournament = this.handleDeleteTournament.bind(this);

        this.crudTableRef = React.createRef();
    }

    handleRowClick(selectedRowId)
    {
        this.setState({
            selectedRowsIds: selectedRowId
        });

        this.props.history.push("/tournament_component/" + selectedRowId[0]);
    }

    handleRowSelection(selectedRows)
    {
        this.setState({
            selectedRowsIds: selectedRows
        });
    }

    handleDeleteTournament()
    {   
        if ( this.state.selectedRowsIds != null && this.state.selectedRowsIds.length == 1 )
        {
            if ( !window.confirm("Are you sure?") )										
		        return;
            
            fetch(EVENTS_API_URL + "/" + this.state.selectedRowsIds[0], {
                method: "DELETE",
                headers : {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + currentUser.accessToken
                }
            })
            .then(result => {
                let formData = new FormData();
                formData.append("dir", "/images/tournaments/" + this.state.selectedRowsIds[0]);

                fetch(Urls.EXPRESS_JS_URL + "/clear_dir", {
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + currentUser.accessToken
                    },
                    body: formData
                })
                .then(() => { console.log("Image directory removed.") });

                this.setState({ selectedRowsIds: [] });
                this.crudTableRef.current.unselectAllRows();
                this.crudTableRef.current.fillTable();
            },
            error => {
                console.log("Item not deleted");
            })
        }            
        else alert("Please select one tournament to remove");
    }

    render()
    {
        const t = this.props.t;

        columns[Columns.TOURNAMENT_NAME] = {...columns[Columns.TOURNAMENT_NAME], text: t("tournament"), filter: textFilter({ placeholder: t("enter_tournament_name")})};
        columns[Columns.START_DATE] = {...columns[Columns.START_DATE], text: t("start_date"), filter: textFilter({ placeholder: t("enter_start_date")})};
        columns[Columns.TEAMS_SIGNED_IN] = {...columns[Columns.TEAMS_SIGNED_IN], text: t("teams_registered")};

        this.props.navbarControlsHandler();

        return(
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            ( 
                <div>
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                <CrudTableComponent itemsUrl={TOURNAMENT_EVENTS_URL}
                                                    tableColumns={columns} 
                                                    selectedItemId={this.handleRowClick} 
                                                    selectedIds={this.handleRowSelection}
                                                    ref={this.crudTableRef}
                                />             
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

export default withTranslation('translation', { withRef: true })(Tournaments);