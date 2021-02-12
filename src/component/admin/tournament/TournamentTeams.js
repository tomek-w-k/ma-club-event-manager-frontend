import React, {Component} from "react";
import CrudTableComponent from "../../CrudTableComponent";
import {
    Card,    
    Alert
} from "react-bootstrap";
import {textFilter} from 'react-bootstrap-table2-filter';
import {withRouter} from "react-router-dom";
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();

const ColumnNames = Object.freeze({
    ID: 0,    
    TRAINER: 1,
    CLUB: 2,    
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
        hidden: true,        
    },
    {
        dataField: "trainer.fullName",
        text: "Trainer",
        sort: true, 
        filter: textFilter(),
        headerFormatter: headerFormatter
    },
    {
        dataField: "trainer.club.clubName",
        text: "Club",
        sort: true, 
        filter: textFilter(),
        headerFormatter: headerFormatter
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
        this.handleShowAddTeamModal = this.handleShowAddTeamModal.bind(this);

        this.crudTableRef = React.createRef();
    }

    componentDidMount()
    {
        fetch(Urls.WEBSERVICE_URL + "/tournament_events/" + this.props.id + "/teams", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
        })
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

    handleShowAddTeamModal()
    {
        console.log("handle add team modal")
    }

    render()
    {
        const TEAMS_FOR_TOURNAMENT = Urls.WEBSERVICE_URL + "/tournament_events/" + this.props.id + "/teams";
        const t = this.props.t;

        columns[ColumnNames.TRAINER] = {...columns[ColumnNames.TRAINER], text: t("trainer"), filter: textFilter({ placeholder: t("enter_trainer")})};
        columns[ColumnNames.CLUB] = {...columns[ColumnNames.CLUB], text: t("club"), filter: textFilter({ placeholder: t("enter_club")})};

        return (
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ? 
            (
                <div>
                    <Card>                            
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

export default withTranslation('translation', { withRef: true })(withRouter(TournamentTeams))
