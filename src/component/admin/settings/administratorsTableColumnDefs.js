import { textFilter } from 'react-bootstrap-table2-filter';
import { searchableHeaderFormatter } from "../../../utils/searchableHeaderFormatter";


export const ColumnNames = Object.freeze ({
    ID: 0,
    FULL_NAME: 1,
    EMAIL: 2
});

export const administratorsTableColumnDefs = [
    {
        dataField: "id",
        sort: false,
        hidden: true
    },
    {
        dataField: "fullName",
        text: "",
        sort: true, 
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter,
    },
    {
        dataField: "email", 
        text: "",
        sort: false,        
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter,                     
    }
];