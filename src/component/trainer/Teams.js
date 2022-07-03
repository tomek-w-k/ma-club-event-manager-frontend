import React, {Component} from "react";
import CrudTableComponent from "../CrudTableComponent";
import {
    Card,
    Alert
} from "react-bootstrap";
import {textFilter} from 'react-bootstrap-table2-filter';
import { withTranslation } from "react-i18next";
import AuthService from "../../service/auth-service";
import * as Urls from "../../servers-urls";
import { ColumnNames } from "./teamsTableColumnDefs";
import { teamsTableColumnDefs as columns } from "./teamsTableColumnDefs";


const currentUser = AuthService.getCurrentUser();


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
        this.setState({ selectedRowsIds: selectedRowId });
        this.props.history.push("/user/" + this.props.match.params.userId + "/team_component/" + selectedRowId[0]);
    }

    handleRowSelection(selectedRows)
    {
        this.setState({ selectedRowsIds: selectedRows });
    }

    handleDeleteTeam()
    {
        const t = this.props.t;
        
        if ( this.state.selectedRowsIds != null && this.state.selectedRowsIds.length == 1 )
        {
            if ( !window.confirm(t("are_you_sure")) )										
		        return;
            
            fetch(Urls.WEBSERVICE_URL + "/user/" + this.props.match.params.userId + "/teams/" + this.state.selectedRowsIds[0], {
                method: "DELETE",
                headers : {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + currentUser.accessToken
                }
            })
            .then(result => {
                this.setState({ selectedRowsIds: [] });
                this.crudTableRef.current.unselectAllRows();
                this.crudTableRef.current.fillTable();
            },
                error => console.log("Item not deleted")
            )
        }            
        else alert(t("select_one_team_to_remove"));
    }

    render()
    {
        const TEAMS_FOR_TRAINER_URL = Urls.WEBSERVICE_URL + "/user/" + this.props.match.params.userId + "/teams";
        const t = this.props.t;

        columns[ColumnNames.TEAM_FOR_TOURNAMENT] = {...columns[ColumnNames.TEAM_FOR_TOURNAMENT], text: t("team_for_tournament"), filter: textFilter({ placeholder: t("enter_tournament_name")})};

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
            ) : (
                <Alert variant="danger">
                    <Alert.Heading>Access denided</Alert.Heading>
                    <p>You have no priviledges granted to view this section.</p>
                </Alert> 
            )
        );
    }
}

export default withTranslation('translation', { withRef: true })(Teams);