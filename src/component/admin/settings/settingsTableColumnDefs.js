import { textFilter } from 'react-bootstrap-table2-filter';
import { searchableHeaderFormatter } from "../../../utils/searchableHeaderFormatter";


export const BranchChiefTableColumnNames = Object.freeze ({
    ID: 0,
    BRANCH_CHIEF_NAME: 1,    
});

export const ClubTableColumnNames = Object.freeze ({
    ID: 0,
    CLUB_NAME: 1,
});

export const RankTableColumnNames = Object.freeze ({
    ID: 0,
    RANK_NAME: 1,
});

export const branchChiefTableColumns = [
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

export const clubTableColumns = [
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

export const rankTableColumns = [
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
