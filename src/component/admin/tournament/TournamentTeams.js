import React, {Component} from "react";
import CrudTableComponent from "../../CrudTableComponent";
import {
    Card,
    Button,
    Accordion
} from "react-bootstrap";
import {textFilter} from 'react-bootstrap-table2-filter';
import {withRouter} from "react-router-dom";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();


const columns = [
    {
        dataField: "id",        
        sort: false,
        hidden: true,        
    },
    {
        dataField: "trainer.fullName",
        text: "Trainer",
        sort: true, 
        filter: textFilter()
    },
    {
        dataField: "trainer.club.clubName",
        text: "Club",
        sort: true, 
        filter: textFilter()
    }             
];


class TournamentTeams extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            selectedRowsIds: null,
            teams: []
        }

        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.handleDeleteTeam = this.handleDeleteTeam.bind(this);
        this.handleShowAddTeamModal = this.handleShowAddTeamModal.bind(this);

        this.crudTableRef = React.createRef();
    }

    componentDidMount()
    {
        fetch(Urls.WEBSERVICE_URL + "/tournament_events/" + this.props.id + "/teams")
        .then(response => response.json())
        .then(teams => {
            this.setState({ teams: teams });
        })
    }

    handleRowClick(selectedRowId)
    {
        this.setState({
            selectedRowsIds: selectedRowId
        }); 
        
        this.state.teams.forEach(team => {
            if (team.id == selectedRowId[0])                
                this.props.history.push("/user/" + team.trainer.id + "/team_component/" + selectedRowId[0]);
        });
    }

    handleRowSelection(selectedRows)
    {
        this.setState({
            selectedRowsIds: selectedRows
        }, () => this.props.onSelectRow(this.state.selectedRowsIds, this.crudTableRef));        
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

    handleShowAddTeamModal()
    {
        console.log("handle add team modal")
    }

    render()
    {
        const TEAMS_FOR_TOURNAMENT = Urls.WEBSERVICE_URL + "/tournament_events/" + this.props.id + "/teams";

        return (
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ? 
            (
                <div>                    
                    <Accordion defaultActiveKey="0">                    
                        <Card>
                            {/* style={{backgroundColor: "#EAECEE"}} */}
                            <Card.Header >
                                <div className="d-flex">
                                    <div style={{display: "flex", alignItems: "center"}}>REGISTRATIONS BY TEAMS</div>
                                    <Accordion.Toggle className="ml-auto" as={Button} variant="secondary" eventKey="0">Show / Hide</Accordion.Toggle>
                                </div> 
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <Card.Text>
                                    <CrudTableComponent itemsUrl={TEAMS_FOR_TOURNAMENT}
                                                        tableColumns={columns} 
                                                        selectedItemId={this.handleRowClick} 
                                                        selectedIds={this.handleRowSelection}
                                                        ref={this.crudTableRef}
                                    />  
                                </Card.Text>
                            </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
            ) : ( <h2>You have no priviledges granted to view this section.</h2> )
        );
    }
}

export default withRouter(TournamentTeams);
