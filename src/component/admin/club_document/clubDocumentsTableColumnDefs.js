import { textFilter } from 'react-bootstrap-table2-filter';
import { searchableHeaderFormatter } from "../../../utils/searchableHeaderFormatter";


export const ColumnNames = Object.freeze ({
    ID: 0,
    DESCRIPTION: 1,
    FILE_NAME: 2,    
});

export const clubDocumentsTableColumnDefs = [
    {
        dataField: "id",
        sort: false,
        hidden: true
    },
    {
        dataField: "clubDocumentDescription",
        text: "Description",
        sort: true, 
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter
    },
    {
        dataField: "clubDocumentPath", 
        text: "File name",
        sort: false,        
        filter: textFilter(),
        formatter: (cell, row) => { return cell.split('\\').pop().split('/').pop() },
        headerFormatter: searchableHeaderFormatter
    }          
];
