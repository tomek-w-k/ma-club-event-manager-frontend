import { textFilter } from 'react-bootstrap-table2-filter';
import { searchableHeaderFormatter } from "../../../utils/searchableHeaderFormatter";
import { booleanTableCellFormatter } from "../../../utils/booleanTableCellFormatter";
import { booleanTableCellStyle } from "../../../utils/booleanTableCellStyle";


export const ColumnNames = Object.freeze({
    ID: 0,
    FULL_NAME: 1,
    TRAINER: 2,
    CLUB: 3,
    FEE_RECEIVED: 4,
    SAYONARA: 5,
    AS_JUDGE_PARTICIPATION: 6,
    ROOM_TYPE_NAME: 7,
    STAY_PERIOD_NAME: 8,
    CATEGORY_NAME: 9
});

export const tournamentRegistrationsTableColumnDefs = [
    {
        dataField: "id",
        sort: false,
        hidden: true
    },
    {
        dataField: "user.fullName",
        text: "",
        sort: true, 
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter
    }, 
    {
        dataField: "trainerFullName",
        text: "",
        sort: true, 
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter
    },   
    {
        dataField: "user.club.clubName",
        text: "",
        sort: true, 
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter 
    },
    { 
        dataField: "feeReceived", 
        text: "",
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
        dataField: "sayonaraMeetingParticipation", 
        text: "",
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
        dataField: "asJudgeParticipation",
        text: "",
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
        dataField: "roomType.roomTypeName",
        text: "",
        hidden: true,
        sort: true, 
        filter: textFilter(),
        formatter: (cell, row) => {
            if (typeof cell == "undefined" )
                return "-"
            else return cell;
        },
        headerFormatter: searchableHeaderFormatter
    },
    {
        dataField: "stayPeriod.stayPeriodName",
        text: "",
        hidden: true,
        sort: true, 
        filter: textFilter(),
        formatter: (cell, row) => {
            if (typeof cell == "undefined" )
                return "-"
            else return cell;
        },
        headerFormatter: searchableHeaderFormatter 
    },
    {
        dataField: "weightAgeCategory.categoryName",
        text: "",
        sort: true, 
        filter: textFilter(),
        formatter: (cell, row) => {
            if (typeof cell == "undefined" )
                return "-"
            else return cell;
        },
        headerFormatter: searchableHeaderFormatter 
    },    
];
