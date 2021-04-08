import React, {Component} from "react";
import CrudTableComponent from "../../CrudTableComponent";
import {
    Card,    
    Alert
} from "react-bootstrap";
import { textFilter } from 'react-bootstrap-table2-filter';
import {Check, SortUp, X} from "react-bootstrap-icons";
import EditTournamentRegistrationModal from "./EditTournamentRegistrationModal";
import AddParticipantToTournamentModal from "./AddParticipantToTournamentModal";
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";
import { searchableHeaderFormatter } from "../../../utils/searchableHeaderFormatter";
import { booleanTableCellFormatter } from "../../../utils/booleanTableCellFormatter";
import { booleanTableCellStyle } from "../../../utils/booleanTableCellStyle";


const currentUser = AuthService.getCurrentUser();
const TOURNAMENT_REGISTRATIONS = Urls.WEBSERVICE_URL + "/tournament_registrations";
const TOURNAMENT_EVENTS = Urls.WEBSERVICE_URL + "/tournament_events";

const ColumnNames = Object.freeze({
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

const columns = [
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


class TournamentRegistrations extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            editModalShow: false,
            addModalShow: false,            
            selectedRowsIds: [],            
            sayonaraMeeting: false,
            accommodation: false
        };
               
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.fillTable = this.fillTable.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);

        this.crudTableRef = React.createRef();
    }

    componentDidMount()
    {
        fetch(TOURNAMENT_EVENTS + "/" + this.props.id, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken
            }
         })
        .then(response => response.json())        
        .then(data => {            
            columns[ColumnNames.SAYONARA] = {...columns[ColumnNames.SAYONARA],  hidden: !data.sayonaraMeeting };
            columns[ColumnNames.ROOM_TYPE_NAME] = {...columns[ColumnNames.ROOM_TYPE_NAME], hidden: !data.accommodation};
            columns[ColumnNames.STAY_PERIOD_NAME] = {...columns[ColumnNames.STAY_PERIOD_NAME], hidden: !data.accommodation};
            
            this.setState({ 
                sayonaraMeeting: data.sayonaraMeeting,
                accommodation: data.accommodation
            });
            this.forceUpdate();
        });
    }

    handleShowAddParticipantModal()
    {
        this.setState({ addModalShow: true });
    }
   
    handleRowClick(selectedRowsIds)
    {
        this.setState({ 
            editModalShow: true,
            selectedRowsIds: selectedRowsIds            
        });  
    }

    handleRowSelection(selectedRowsIds)
    {
        this.setState({
            selectedRowsIds: selectedRowsIds
        });
    }

    fillTable()
    {
        this.crudTableRef.current.fillTable();
    }

    handleDeleteItem()
    {
        const t = this.props.t;

        if ( this.state.selectedRowsIds.length == 1 )
        {
            if ( !window.confirm("Are you sure?") )
                return;

            fetch(TOURNAMENT_REGISTRATIONS + "/" + this.state.selectedRowsIds[0], {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + currentUser.accessToken
                }
            })
            .then(result => {
                this.setState({ selectedRowsIds: [] });
                this.crudTableRef.current.unselectAllRows();
                this.crudTableRef.current.fillTable();
            },
            error => {
                alert("Item not deleted.")
            })
        }
        else alert(t("select_one_participant_to_remove"));
    }

    render()
    {
        const TOURNAMENT_REGISTRATIONS_FOR_TOURNAMENT = Urls.WEBSERVICE_URL + "/tournament_events/" + this.props.id + "/tournament_registrations";
        const t = this.props.t;

        columns[ColumnNames.FULL_NAME] = {...columns[ColumnNames.FULL_NAME], text: t("full_name"), filter: textFilter({ placeholder: t("enter_full_name")})};
        columns[ColumnNames.TRAINER] = {...columns[ColumnNames.TRAINER], text: t("trainer"), filter: textFilter({ placeholder: t("enter_email")})};
        columns[ColumnNames.CLUB] = {...columns[ColumnNames.CLUB], text: t("club"), filter: textFilter({ placeholder: t("enter_club")})};
        columns[ColumnNames.FEE_RECEIVED] = {...columns[ColumnNames.FEE_RECEIVED], text: t("fee_received")};
        columns[ColumnNames.SAYONARA] = {...columns[ColumnNames.SAYONARA], text: t("sayonara")};
        columns[ColumnNames.AS_JUDGE_PARTICIPATION] = {...columns[ColumnNames.AS_JUDGE_PARTICIPATION], text: t("as_judge")};
        columns[ColumnNames.ROOM_TYPE_NAME] = {...columns[ColumnNames.ROOM_TYPE_NAME], text: t("room_type"), filter: textFilter({ placeholder: t("enter_room_type")})};
        columns[ColumnNames.STAY_PERIOD_NAME] = {...columns[ColumnNames.STAY_PERIOD_NAME], text: t("stay_period"), filter: textFilter({ placeholder: t("enter_stay_period")})};
        columns[ColumnNames.CATEGORY_NAME] = {...columns[ColumnNames.CATEGORY_NAME], text: t("weight_age_category"), filter: textFilter({ placeholder: t("enter_category")})};

        return(            
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <div>
                    <EditTournamentRegistrationModal    show={this.state.editModalShow}
                                                        onHide={() => {
                                                            this.setState({ editModalShow: false, selectedRowsIds: [] });
                                                            this.crudTableRef.current.unselectAllRows();
                                                            this.fillTable();
                                                            this.props.onRegistrationUpdate();
                                                        }}
                                                        itemId={this.state.selectedRowsIds[0]}
                                                        eventId={this.props.id}
                                                        sayonaraMeeting={this.state.sayonaraMeeting}
                                                        accommodation={this.state.accommodation}
                    />              
                    <AddParticipantToTournamentModal    show={this.state.addModalShow}
                                                        onHide={() => {
                                                            this.setState({ addModalShow: false, selectedRowsIds: [] });
                                                            this.crudTableRef.current.unselectAllRows();
                                                            this.fillTable();                                                    
                                                        }}
                                                        itemId={this.state.selectedRowsIds[0]}
                                                        eventId={this.props.id}
                                                        sayonaraMeeting={this.state.sayonaraMeeting}
                                                        accommodation={this.state.accommodation}
                    />
                    <Card>                        
                        <Card.Body>
                            <Card.Text>
                                <CrudTableComponent itemsUrl={TOURNAMENT_REGISTRATIONS_FOR_TOURNAMENT} 
                                                    tableColumns={columns} 
                                                    selectedItemId={this.handleRowClick}
                                                    selectedIds={this.handleRowSelection}
                                                    ref={this.crudTableRef}
                                />
                            </Card.Text>
                        </Card.Body>                        
                    </Card>                   
                </div>
            ) : (
                <Alert variant="danger">
                    <Alert.Heading>Access denided</Alert.Heading>
                    <p>You have no priviledges granted to view this section.</p>
                </Alert> 
            )
        );
    }
}

export default withTranslation('translation', { withRef: true })(TournamentRegistrations);