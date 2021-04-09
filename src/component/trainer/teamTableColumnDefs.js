import {textFilter} from 'react-bootstrap-table2-filter';
import { searchableHeaderFormatter } from "../../utils/searchableHeaderFormatter";
import { booleanTableCellFormatter } from "../../utils/booleanTableCellFormatter";
import { booleanTableCellStyle } from "../../utils/booleanTableCellStyle";


export const ColumnNames = Object.freeze({
    ID: 0,
    FULL_NAME: 1,
    CLUB_NAME: 2,
    FEE_RECEIVED: 3,
    SAYONARA_MEETING_PARTICIPATION: 4,
    AS_JUDGE_PARTICIPATION: 5,
    ROOM_TYPE_NAME: 6,
    STAY_PERIOD_NAME: 7,
    CATEGORY_NAME: 8
});

export const teamTableColumnDefs = [
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
        dataField: "user.club.clubName",
        text: "Club",
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
        text: "Room type",
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
        text: "Stay period",
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
        text: "Weight / age category",
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
