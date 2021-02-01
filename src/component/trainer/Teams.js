import React, {Component} from "react";
import CrudTableComponent from "../CrudTableComponent";
import {Card} from "react-bootstrap";
import {textFilter} from 'react-bootstrap-table2-filter';
import AuthService from "../../service/auth-service";
import * as Urls from "../../servers-urls";


const currentUser = AuthService.getCurrentUser();


const columns = [
    {
        dataField: "id",        
        sort: false,
        hidden: true,        
    },
    {
        dataField: "eventName",
        text: "Team for",
        sort: true, 
        filter: textFilter()
    }             
];


class Teams extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            selectedRowsIds: null
        }

        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.handleDeleteTeam = this.handleDeleteTeam.bind(this);

        this.crudTableRef = React.createRef();
    }

    handleRowClick(selectedRowId)
    {
        this.setState({
            selectedRowsIds: selectedRowId
        });

        this.props.history.push("/user/" + this.props.match.params.userId + "/team_component/" + selectedRowId[0]);
    }

    handleRowSelection(selectedRows)
    {
        this.setState({
            selectedRowsIds: selectedRows
        });
    }

    handleDeleteTeam()
    {
        if ( this.state.selectedRowsIds != null && this.state.selectedRowsIds.length == 1 )
        {
            if ( !window.confirm("Are you sure?") )										
		        return;
            
            fetch(Urls.WEBSERVICE_URL + "/user/" + this.props.match.params.userId + "/teams/" + this.state.selectedRowsIds[0], {
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
        else alert("Please select one camp to remove");
    }

    render()
    {
        const TEAMS_FOR_TRAINER_URL = Urls.WEBSERVICE_URL + "/user/" + this.props.match.params.userId + "/teams";

        this.props.navbarControlsHandler();

        return (
            currentUser != null && currentUser.roles.includes("ROLE_TRAINER") ? 
            (
                <div>
                    <Card>
                        <Card.Body>
                            <Card.Text> 
                                <CrudTableComponent itemsUrl={TEAMS_FOR_TRAINER_URL}
                                                    tableColumns={columns} 
                                                    selectedItemId={this.handleRowClick} 
                                                    selectedIds={this.handleRowSelection}
                                                    ref={this.crudTableRef}
                                />             
                            </Card.Text>
                        </Card.Body>
                    </Card>                    
                </div>
            ) : ( <h2>You have no priviledges granted to view this section.</h2> )
        );
    }
}

export default Teams;