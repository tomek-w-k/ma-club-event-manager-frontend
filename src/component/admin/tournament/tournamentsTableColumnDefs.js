import { textFilter } from 'react-bootstrap-table2-filter';
import { searchableHeaderFormatter } from "../../../utils/searchableHeaderFormatter";


export const ColumnNames = Object.freeze ({
    ID: 0,
    TOURNAMENT_NAME: 1,
    START_DATE: 2,
    TEAMS_SIGNED_IN: 3,    
});

export const tournamentsTableColumnDefs = [
    {
        dataField: "id",
        sort: false,
        hidden: true
    },
    {
        dataField: "eventName",
        text: "Event name",
        sort: true, 
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter,
        style: (colum, colIndex) => {
            return { width: '60%', textAlign: 'left' };
        },           
    },
    {
        dataField: "startDate", 
        text: "Start date",
        sort: true,
        type: "date",
        style: (colum, colIndex) => {
            return { width: '20%', textAlign: 'center' };
        }, 
        headerStyle:  { "text-align": "center" },
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter,                       
    },
    {            
        dataField: "teams.length",        
        text: "Persons signed in",
        sort: false,
        style: (colum, colIndex) => {
            return { width: '20%', textAlign: 'center' };
        },
        headerStyle:  { "text-align": "center" },
        filter: textFilter({            
            disabled: "true",
            placeholder: "-"
        }),
        headerFormatter: searchableHeaderFormatter
    }          
];