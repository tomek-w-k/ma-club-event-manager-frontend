import { textFilter } from 'react-bootstrap-table2-filter';
import { searchableHeaderFormatter } from "../../utils/searchableHeaderFormatter";


export const ColumnNames = Object.freeze ({
    ID: 0,
    TEAM_FOR_TOURNAMENT: 1,    
});

export const teamsTableColumnDefs = [
    {
        dataField: "id",        
        sort: false,
        hidden: true,        
    },
    {
        dataField: "eventName",
        text: "",
        sort: true, 
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter
    }             
];
