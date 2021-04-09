import { textFilter } from 'react-bootstrap-table2-filter';
import { searchableHeaderFormatter } from "../../../utils/searchableHeaderFormatter";


export const ColumnNames = Object.freeze ({
    ID: 0,
    FULL_NAME: 1,
    EMAIL: 2,
    CLUB: 3,    
});

export const addAdminPrivilegesTableColumnDefs = [
    {
        dataField: "id",
        sort: false,
        hidden: true
    },
    {
        dataField: "fullName",
        text: "Full name",
        sort: true, 
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter          
    },    
    {
        dataField: "email", 
        text: "",
        sort: false,        
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter,                     
    },
    {            
        dataField: "club.clubName",
        text: "Club",
        sort: true,
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter
    }
];