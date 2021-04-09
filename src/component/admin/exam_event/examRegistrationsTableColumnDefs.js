import { textFilter } from 'react-bootstrap-table2-filter';
import { searchableHeaderFormatter } from "../../../utils/searchableHeaderFormatter";
import { booleanTableCellFormatter } from "../../../utils/booleanTableCellFormatter";
import { booleanTableCellStyle } from "../../../utils/booleanTableCellStyle";


export const ColumnNames = Object.freeze ({
    ID: 0,
    FULL_NAME: 1,
    EMAIL: 2,    
    CLUB: 3,
    FEE_RECEIVED: 4,
    PARTICIPATION_ACCEPTED: 5,
});

export const examRegistrationsTableColumnDefs = [
    {
        dataField: "id",
        sort: false,
        hidden: true
    },
    {
        dataField: "user.fullName",
        text: "Full name",
        sort: true, 
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter          
    },
    {
        dataField: "user.email",
        text: "Email",
        sort: true, 
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter         
    },
    {
        dataField: "user.club.clubName",
        text: "Club",
        sort: true, 
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter          
    },
    { 
        dataField: "feeReceived", 
        text: "Fee received",
        sort: false,
        type: "bool",
        style: booleanTableCellStyle,        
        headerStyle:  { "text-align": "center" },
        formatter: booleanTableCellFormatter,                         
        filter: textFilter({            
            disabled: "true",
            placeholder: "-"
        }),        
        headerFormatter: searchableHeaderFormatter  
    },
    { 
        dataField: "participationAccepted", 
        text: "Participation accepted",
        sort: false,
        type: "bool",
        style: booleanTableCellStyle,        
        headerStyle:  { "text-align": "center" },
        formatter: booleanTableCellFormatter,                           
        filter: textFilter({            
            disabled: "true",
            placeholder: "-"
        }),
        headerFormatter: searchableHeaderFormatter          
    },             
];
