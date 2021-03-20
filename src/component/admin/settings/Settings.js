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
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();
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
    }

    render()
    {
        const t = this.props.t;

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
                    <Tabs defaultActiveKey="branchChiefs" className="tabsHeader">  
                        <Tab eventKey="branchChiefs" title={t("branch_chiefs_capital")}>
                            <Card>
                                <Card.Body>
                                    <Card.Text>
                                        <CrudTableComponent itemsUrl={BRANCH_CHIEFS_URL} 
                                                            tableColumns={branchChiefTableColumns} 
                                                            selectedItemId={this.handleRowClick} 
                                                            selectedIds={this.handleRowSelection}
                                                            ref={this.crudTableRef}
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
                                                            selectedItemId={this.handleRowClick} 
                                                            selectedIds={this.handleRowSelection}
                                                            ref={this.crudTableRef}
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
                                                            selectedItemId={this.handleRowClick} 
                                                            selectedIds={this.handleRowSelection}
                                                            ref={this.crudTableRef}
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

export default withTranslation('translation', { withRef: true })(withRouter(Settings));