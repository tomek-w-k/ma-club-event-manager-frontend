import { textFilter } from 'react-bootstrap-table2-filter';
import { searchableHeaderFormatter } from "../../../utils/searchableHeaderFormatter";


export const ColumnNames = Object.freeze({
    ID: 0,    
    TRAINER: 1,
    CLUB: 2,    
});

export const tournamentTeamsTableColumnDefs = [
    {
        dataField: "id",        
        sort: false,
        hidden: true,        
    },
    {
        dataField: "trainer.fullName",
        text: "Trainer",
        sort: true, 
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter
    },
    {
        dataField: "trainer.club.clubName",
        text: "Club",
        sort: true, 
        filter: textFilter(),
        headerFormatter: searchableHeaderFormatter
    }             
];
