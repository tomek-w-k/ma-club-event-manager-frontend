import React, {Component} from "react";
import CrudTableComponent from "../../CrudTableComponent";
import {Card} from "react-bootstrap";
import {textFilter} from 'react-bootstrap-table2-filter';

import AuthService from "../../../service/auth-service";


const EXAM_EVENTS_URL = "http://localhost:8081/exam_events";
const EVENTS_API_URL = "http://localhost:8081/events";


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
        filter: textFilter()           
    },
    {
        dataField: "startDate", 
        text: "Start date",
        sort: true,
        type: "date",
        filter: textFilter(),                       
    },
    {            
        dataField: "examRegistrations.length",
        text: "Persons signed in",
        sort: false,
        style:  { "text-align": "center" },
    }          
];


class Exams extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            selectedRowsIds: null
        }
        
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.handleDeleteExam = this.handleDeleteExam.bind(this);

        this.crudTableRef = React.createRef();
    }

    handleRowClick(selectedRowId)
    {
        this.setState({
            selectedRowsIds: selectedRowId
        });

        this.props.history.push("/exam_component/" + selectedRowId[0]);
    }

    handleRowSelection(selectedRows)
    {
        this.setState({
            selectedRowsIds: selectedRows
        });
    }

    handleDeleteExam()
    {   
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
        else alert("Please select one camp to remove");
    }

    render()
    {
        const currentUser = AuthService.getCurrentUser();        
        this.props.navbarControlsHandler();
        
        return( 
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            ( 
                <div>
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                <CrudTableComponent itemsUrl={EXAM_EVENTS_URL} 
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
            ( <h2>You do not have priviledges granted to view this section.</h2> )
        );
    }
}

export default Exams;