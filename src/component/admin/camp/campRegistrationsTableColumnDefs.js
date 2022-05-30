import { textFilter } from 'react-bootstrap-table2-filter';
import { searchableHeaderFormatter } from "../../../utils/searchableHeaderFormatter";
import { booleanTableCellFormatter } from "../../../utils/booleanTableCellFormatter";
import { booleanTableCellStyle } from "../../../utils/booleanTableCellStyle";


export const ColumnNames = Object.freeze ({
    ID: 0,
    FULL_NAME: 1,
    EMAIL: 2,    
    CLUB: 3,
    ADVANCE_PAYMENT_RECEIVED: 4,
    FEE_RECEIVED: 5,
    SAYONARA: 6,
    CLOTHING_SIZE: 7,
    ACCOMMODATION: 8,
});

export const campRegistrationsTableColumnDefs = [
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
        dataField: "advancePaymentReceived", 
        text: "Advance payment received",
        sort: false,
        type: "bool",
        style: booleanTableCellStyle,        
        headerFormatter: booleanTableCellFormatter,
        headerStyle:  { "text-align": "center" },
        formatter: booleanTableCellFormatter,        
        filter: textFilter({            
            disabled: "true",
            placeholder: "-"
        }),        
        headerFormatter: searchableHeaderFormatter          
    },
    { 
        dataField: "feeReceived", 
        text: "Fee received",
        sort: false,
        type: "bool",
        style: booleanTableCellStyle,        
        headerFormatter: booleanTableCellFormatter,
        headerStyle:  { "text-align": "center" },
        formatter: booleanTableCellFormatter,        
        filter: textFilter({            
            disabled: "true",
            placeholder: "-"
        }),        
        headerFormatter: searchableHeaderFormatter          
    },
    { 
        dataField: "sayonaraMeetingParticipation", 
        text: "Sayonara",
        hidden: true,
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
        dataField: "clothingSize.clothingSizeName",
        text: "Clothing size",
        sort: true, 
        filter: textFilter(),
        style: booleanTableCellStyle,        
        headerStyle:  { "text-align": "center" },
        formatter: (cell, row) => {
            if (typeof cell == "undefined" )
                return "-"
            else return cell;
        }
    },
    { 
        dataField: "accommodation",
        text: "Accommodation",
        sort: true,
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
