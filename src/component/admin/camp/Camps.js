import React, {Component} from "react";
import CrudTableComponent from "../../CrudTableComponent";
import {Card} from "react-bootstrap";
import {textFilter} from 'react-bootstrap-table2-filter';
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const CAMP_EVENTS_URL = Urls.WEBSERVICE_URL + "/camp_events";
const EVENTS_API_URL = Urls.WEBSERVICE_URL + "/events";

const Columns = Object.freeze ({
    ID: 0,
    CAMP_NAME: 1,
    START_DATE: 2,
    PERSONS_SIGNED_IN: 3,    
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
        text: "",
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
        dataField: "campRegistrations.length",
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


class CampsComponent extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            selectedRowsIds: null
        }
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.handleDeleteCamp = this.handleDeleteCamp.bind(this);

        this.crudTableRef = React.createRef();
    }

    handleRowClick(selectedRowId)
    {
        this.setState({
            selectedRowsIds: selectedRowId
        });

        this.props.history.push("/camp_component/" + selectedRowId[0]);
    }

    handleRowSelection(selectedRows)
    {
        this.setState({
            selectedRowsIds: selectedRows
        });
    }

    handleDeleteCamp()
    {   
        const t = this.props.t;
        
        if ( this.state.selectedRowsIds != null && this.state.selectedRowsIds.length == 1 )
        {
            if ( !window.confirm("Are you sure?") )										
		        return;
            
            fetch(EVENTS_API_URL + "/" + this.state.selectedRowsIds[0], {
                method: "DELETE",
                header : {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            })
            .then(result => {
                this.setState({ selectedRowsIds: [] });
                this.crudTableRef.current.unselectAllRows();
                this.crudTableRef.current.fillTable();
            },
            error => {
                console.log("Item not deleted");
            })
        }            
        else alert(t("select_one_camp_to_remove"));
    }

    render()
    {
        const currentUser = AuthService.getCurrentUser();
        const t = this.props.t;

        columns[Columns.CAMP_NAME] = {...columns[Columns.CAMP_NAME], text: t("camp"), filter: textFilter({ placeholder: t("enter_camp_name")})};
        columns[Columns.START_DATE] = {...columns[Columns.START_DATE], text: t("start_date"), filter: textFilter({ placeholder: t("enter_start_date")})};
        columns[Columns.PERSONS_SIGNED_IN] = {...columns[Columns.PERSONS_SIGNED_IN], text: t("persons_registered")};
        
        this.props.navbarControlsHandler();

        return(
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            ( 
                <div>
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                <CrudTableComponent itemsUrl={CAMP_EVENTS_URL}
                                                    tableColumns={columns} 
                                                    selectedItemId={this.handleRowClick} 
                                                    selectedIds={this.handleRowSelection}
                                                    ref={this.crudTableRef}
                                />             
                            </Card.Text>
                        </Card.Body>
                    </Card>                    
                </div>
            ) :
            ( <h2>You do not have priviledges  granted to view this section.</h2> )
        );
    }
}

export default withTranslation('translation', { withRef: true })(CampsComponent);