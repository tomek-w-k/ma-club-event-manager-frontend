import React, { Component } from "react";
import {
    Alert,
    Card,
    Tabs,
    Tab
} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";
import { withTranslation } from "react-i18next";
import CrudTableComponent from "../../CrudTableComponent";
import { textFilter } from 'react-bootstrap-table2-filter';
import InformationDialogModal from "../../InformationDialogModal";
import ConfirmationDialogModal from "../../ConfirmationDialogModal";
import EditSelectableUserOptionModal from "./EditSelectableUserOptionModal";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();
const BRANCH_CHIEFS_SELECTABLE_OPTION = "branchChiefs";
const CLUBS_SELECTABLE_OPTION = "clubs";
const RANKS_SELECTABLE_OPTION = "ranks";
const BRANCH_CHIEFS_URL = Urls.WEBSERVICE_URL + "/branch_chiefs";
const CLUBS_URL = Urls.WEBSERVICE_URL + "/clubs";
const RANKS_URL = Urls.WEBSERVICE_URL + "/ranks";

const BranchChiefTableColumnNames = Object.freeze ({
    ID: 0,
    BRANCH_CHIEF_NAME: 1,    
});

const ClubTableColumnNames = Object.freeze ({
    ID: 0,
    CLUB_NAME: 1,
});

const RankTableColumnNames = Object.freeze ({
    ID: 0,
    RANK_NAME: 1,
})

const searchableHeaderFormatter = (column, colIndex, { sortElement, filterElement }) => {
    return (
        <div style={ { display: 'flex', flexDirection: 'column' } }>            
            { column.text }            
            { filterElement }
            { sortElement }
        </div>
    );
};

const branchChiefTableColumns = [
    {
        dataField: "id",
        sort: false,
        hidden: true
    },
    {
        dataField: "branchChiefName",
        text: "",
        sort: true, 
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter,
    }    
];

const clubTableColumns = [
    {
        dataField: "id",
        sort: false,
        hidden: true
    },
    {
        dataField: "clubName",
        text: "",
        sort: true, 
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter,
    }    
];

const rankTableColumns = [
    {
        dataField: "id",
        sort: false,
        hidden: true
    },
    {
        dataField: "rankName",
        text: "",
        sort: true, 
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter,
    }    
];


class Settings extends Component
{
    constructor(props)
    {
        super(props);        
        this.state = {
            selectedBranchChiefsTableRowsIds: [],
            selectedClubsTableRowsIds: [],
            selectedRanksTableRowsIds: [],
            showEditModal: false,
            showInformationModal: false,
            showConfirmDeleteSelectableOptionModal: false,            
        }
        this.setSelectedTab = this.setSelectedTab.bind(this);
        this.isOptionSelectedCorrectly = this.isOptionSelectedCorrectly.bind(this);
        this.getSelectedOptionId = this.getSelectedOptionId.bind(this);
        this.getSelectableOptionEndpointUrl = this.getSelectableOptionEndpointUrl.bind(this);
        this.selectOneSelectableOptionToRemoveMessage = this.selectOneSelectableOptionToRemoveMessage.bind(this);
        this.confirmDeleteSelectableUserOption = this.confirmDeleteSelectableUserOption.bind(this);
        this.handleDeleteSelectableUserOption = this.handleDeleteSelectableUserOption.bind(this);
        this.handleBranchChiefsTableRowClick = this.handleBranchChiefsTableRowClick.bind(this);
        this.handleBranchChiefsTableRowSelection = this.handleBranchChiefsTableRowSelection.bind(this);        
        this.handleClubsTableRowClick = this.handleClubsTableRowClick.bind(this);
        this.handleClubsTableRowSelection = this.handleClubsTableRowSelection.bind(this);        
        this.hanldeRanksTableRowClick = this.hanldeRanksTableRowClick.bind(this);
        this.refreshTable = this.refreshTable.bind(this);
        this.unselectTableRows = this.unselectTableRows.bind(this);
        this.handleRanksTableRowSelection = this.handleRanksTableRowSelection.bind(this);      
        
        this.branchChiefsTableRef = React.createRef();
        this.clubsTableRef = React.createRef();
        this.ranksTableRef = React.createRef();
    }

    setSelectedTab(key)
    {        
        this.props.setSelectedTab(key);
    }

    isOptionSelectedCorrectly()
    {
        switch ( localStorage.getItem("settingsSelectedTab") )
        {
            case BRANCH_CHIEFS_SELECTABLE_OPTION: 
                if ( this.state.selectedBranchChiefsTableRowsIds != null && this.state.selectedBranchChiefsTableRowsIds.length == 1 )
                    return true; else return false;            
            case CLUBS_SELECTABLE_OPTION: 
                if ( this.state.selectedClubsTableRowsIds != null && this.state.selectedClubsTableRowsIds.length == 1 )
                    return true; else return false;
            case RANKS_SELECTABLE_OPTION: 
                if ( this.state.selectedRanksTableRowsIds != null && this.state.selectedRanksTableRowsIds.length == 1 )
                    return true; else return false;
            default: return false;
        }
    }

    getSelectedOptionId()
    {
        switch ( localStorage.getItem("settingsSelectedTab") )
        {
            case BRANCH_CHIEFS_SELECTABLE_OPTION: return this.state.selectedBranchChiefsTableRowsIds[0];                           
            case CLUBS_SELECTABLE_OPTION: return this.state.selectedClubsTableRowsIds[0];                
            case RANKS_SELECTABLE_OPTION: return this.state.selectedRanksTableRowsIds[0];  
        }
    }

    getSelectableOptionEndpointUrl()
    {
        switch ( localStorage.getItem("settingsSelectedTab") )
        {
            case BRANCH_CHIEFS_SELECTABLE_OPTION: return BRANCH_CHIEFS_URL;
            case CLUBS_SELECTABLE_OPTION: return CLUBS_URL;
            case RANKS_SELECTABLE_OPTION: return RANKS_URL;
        }
    }

    refreshTable()
    {
        switch ( localStorage.getItem("settingsSelectedTab") )
        {
            case BRANCH_CHIEFS_SELECTABLE_OPTION: this.branchChiefsTableRef.current.fillTable(); break;
            case CLUBS_SELECTABLE_OPTION: this.clubsTableRef.current.fillTable(); break;
            case RANKS_SELECTABLE_OPTION: this.ranksTableRef.current.fillTable(); break;
        }
    }

    unselectTableRows()
    {        
        switch ( localStorage.getItem("settingsSelectedTab") )
        {
            case BRANCH_CHIEFS_SELECTABLE_OPTION: {
                this.setState({ selectedBranchChiefsTableRowsIds: [] });
                this.branchChiefsTableRef.current.unselectAllRows(); 
                break;
            }
            case CLUBS_SELECTABLE_OPTION: {
                this.setState({ selectedClubsTableRowsIds: [] });
                this.clubsTableRef.current.unselectAllRows(); 
                break;
            }
            case RANKS_SELECTABLE_OPTION: {
                this.setState({ selectedRanksTableRowsIds: [] });
                this.ranksTableRef.current.unselectAllRows(); 
                break;
            }
        }
    }

    selectOneSelectableOptionToRemoveMessage()
    {
        const t = this.props.t;

        switch ( localStorage.getItem("settingsSelectedTab") )
        {
            case BRANCH_CHIEFS_SELECTABLE_OPTION: {
                this.setState({ 
                    errorMessage: t("select_one_branch_chief_to_remove"),
                    showInformationModal: true
                });
                 break; 
            }
            case CLUBS_SELECTABLE_OPTION: {
                this.setState({ 
                    errorMessage: t("select_one_club_to_remove"),
                    showInformationModal: true
                }); 
                 break;
            }
            case RANKS_SELECTABLE_OPTION: {
                this.setState({ 
                    errorMessage: t("select_one_rank_to_remove"),
                    showInformationModal: true
                }); 
                break;
            }
        }
    }

    confirmDeleteSelectableUserOption()
    {
        if ( this.isOptionSelectedCorrectly() )
            this.setState({ showConfirmDeleteSelectableOptionModal: true });
        else this.selectOneSelectableOptionToRemoveMessage();
    }

    handleDeleteSelectableUserOption(confirmed)
    {   
        const t = this.props.t;
        
        if ( !confirmed )
        {
            this.unselectTableRows();
            return;
        }                
        
        let selectableOptionEndpointUrl = this.getSelectableOptionEndpointUrl();

        fetch(selectableOptionEndpointUrl + "/" + this.getSelectedOptionId(), {
            method: "DELETE",
            headers : {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentUser.accessToken
            }
        })
        .then(result => {
            if ( result.ok ) {                    
                this.refreshTable();
                this.unselectTableRows();
            } 
            else return result.json();
        },
        error => {                 
            this.setState({ 
                errorMessage: error.message,
                showInformationModal: true
                });                     
            this.unselectTableRows();                
        })
        .then( result => {                 
            if ( result ) {
                this.setState({ 
                    errorMessage: result.message.replace("branch_chief", t("branch_chief"))
                                                .replace("club", t("club"))
                                                .replace("rank", t("rank"))
                                                .replace("branch_chief_cannot_be_removed_because", t("branch_chief_cannot_be_removed_because"))
                                                .replace("club_cannot_be_removed_because", t("club_cannot_be_removed_because"))
                                                .replace("rank_cannot_be_removed_because", t("rank_cannot_be_removed_because")),
                    showInformationModal: true
                    });                     
                this.unselectTableRows();
            }                    
        });               
    }

    handleBranchChiefsTableRowClick(selectedRowId)
    {
        this.setState({ 
            showEditModal: true,
            selectedBranchChiefsTableRowsIds: selectedRowId            
        });
    }
    
    handleBranchChiefsTableRowSelection(selectedRows)
    {
        this.setState({ selectedBranchChiefsTableRowsIds: selectedRows });
    }    
    
    handleClubsTableRowClick(selectedRowId)
    {
        this.setState({ 
            showEditModal: true,
            selectedClubsTableRowsIds: selectedRowId            
        });
    }

    handleClubsTableRowSelection(selectedRows)
    {
        this.setState({ selectedClubsTableRowsIds: selectedRows });
    }
    
    hanldeRanksTableRowClick(selectedRowId)
    {
        this.setState({ 
            showEditModal: true,
            selectedRanksTableRowsIds: selectedRowId            
        });
    }

    handleRanksTableRowSelection(selectedRows)
    {
        this.setState({ selectedRanksTableRowsIds: selectedRows });
    }
    
    render()
    {
        const t = this.props.t;
        const DEFAULT_SELECTED_TAB = localStorage.getItem("settingsSelectedTab") ? localStorage.getItem("settingsSelectedTab") : "branchChiefs";

        branchChiefTableColumns[BranchChiefTableColumnNames.BRANCH_CHIEF_NAME] = 
            {...branchChiefTableColumns[BranchChiefTableColumnNames.BRANCH_CHIEF_NAME], text: t("branch_chief"), filter: textFilter({ placeholder: t("enter_full_name")})};
        clubTableColumns[ClubTableColumnNames.CLUB_NAME] = 
            {...clubTableColumns[ClubTableColumnNames.CLUB_NAME], text: t("club"), filter: textFilter({ placeholder: t("enter_name")})};
        rankTableColumns[RankTableColumnNames.RANK_NAME] = 
            {...rankTableColumns[RankTableColumnNames.RANK_NAME], text: t("rank"), filter: textFilter({ placeholder: t("enter_name")})};

        this.props.navbarControlsHandler();

        return(
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <div>
                    <EditSelectableUserOptionModal  show={this.state.showEditModal}
                                                    onHide={() => {
                                                        this.setState({ showEditModal: false });
                                                        this.unselectTableRows();
                                                        this.refreshTable();                                                        
                                                    }}
                                                    itemId={this.getSelectedOptionId()}                                                                                                      
                    />
                    <ConfirmationDialogModal    show={this.state.showConfirmDeleteSelectableOptionModal}
                                                onHide={() => this.setState({ showConfirmDeleteSelectableOptionModal: false }) }
                                                confirmationResult={this.handleDeleteSelectableUserOption}                                                
                    />
                    <InformationDialogModal modalContent={this.state.errorMessage} 
                                            show={this.state.showInformationModal}
                                            onHide={() => this.setState({ 
                                                errorMessage: "",
                                                showInformationModal: false,
                                            })} 
                    />
                    <Tabs defaultActiveKey={DEFAULT_SELECTED_TAB} className="tabsHeader" onSelect={this.setSelectedTab}>  
                        <Tab eventKey="branchChiefs" title={t("branch_chiefs_capital")}>
                            <Card>
                                <Card.Body>
                                    <Card.Text>
                                        <CrudTableComponent itemsUrl={BRANCH_CHIEFS_URL} 
                                                            tableColumns={branchChiefTableColumns} 
                                                            selectedItemId={this.handleBranchChiefsTableRowClick} 
                                                            selectedIds={this.handleBranchChiefsTableRowSelection}
                                                            ref={this.branchChiefsTableRef}
                                        />             
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Tab>
                        <Tab eventKey="clubs" title={t("clubs_capital")}>
                            <Card>
                                <Card.Body>
                                    <Card.Text>
                                        <CrudTableComponent itemsUrl={CLUBS_URL} 
                                                            tableColumns={clubTableColumns} 
                                                            selectedItemId={this.handleClubsTableRowClick} 
                                                            selectedIds={this.handleClubsTableRowSelection}
                                                            ref={this.clubsTableRef}
                                        />             
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Tab>
                        <Tab eventKey="ranks" title={t("ranks_capital")}>
                            <Card>
                                <Card.Body>
                                    <Card.Text>
                                        <CrudTableComponent itemsUrl={RANKS_URL} 
                                                            tableColumns={rankTableColumns} 
                                                            selectedItemId={this.hanldeRanksTableRowClick} 
                                                            selectedIds={this.handleRanksTableRowSelection}
                                                            ref={this.ranksTableRef}
                                        />             
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Tab>                        
                    </Tabs>
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

export default withTranslation('translation', { withRef: true })(Settings);