import React, {Component} from "react";
import CrudTableComponent from "../../CrudTableComponent";
import {
    Card, 
} from "react-bootstrap";
import { textFilter } from 'react-bootstrap-table2-filter';
import {Check, X} from "react-bootstrap-icons";
import EditExamRegistrationModal from "./EditExamRegistrationModal";
import AddParticipantToExamModal from "./AddParticipantToExamModal";
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const currentUser = AuthService.getCurrentUser();
const EXAM_REGISTRATIONS = Urls.WEBSERVICE_URL + "/exam_registrations";
const EXAM_EVENTS = Urls.WEBSERVICE_URL + "/exam_events";

const Columns = Object.freeze ({
    ID: 0,
    FULL_NAME: 1,
    EMAIL: 2,    
    CLUB: 3,
    FEE_RECEIVED: 4,
    PARTICIPATION_ACCEPTED: 5,
});

const headerFormatter = (column, colIndex, { sortElement, filterElement }) => {
    return (
        <div style={ { display: 'flex', flexDirection: 'column' } }>            
            { column.text }            
            { filterElement }
            { sortElement }
        </div>
    );
};

const columns = [
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
        headerFormatter: headerFormatter          
    },
    {
        dataField: "user.email",
        text: "Email",
        sort: true, 
        filter: textFilter(),
        headerFormatter: headerFormatter         
    },
    {
        dataField: "user.club.clubName",
        text: "Club",
        sort: true, 
        filter: textFilter(),
        headerFormatter: headerFormatter          
    },
    { 
        dataField: "feeReceived", 
        text: "Fee received",
        sort: false,
        type: "bool",
        style: (colum, colIndex) => {
            return { width: '10%', textAlign: 'center' };
        },
        headerStyle:  { "text-align": "center" },
        formatter: (cell, row) => {
            return cell ? (<div><Check color="#008495" size={22}/></div>) : (<div><X color="#CB2334" size={22}/></div>)            
        },                   
        filter: textFilter({            
            disabled: "true",
            placeholder: "-"
        }),        
        headerFormatter: headerFormatter  
    },
    { 
        dataField: "participationAccepted", 
        text: "Participation accepted",
        sort: false,
        type: "bool",
        style: (colum, colIndex) => {
            return { width: '10%', textAlign: 'center' };
        },
        headerStyle:  { "text-align": "center" },
        formatter: (cell, row) => {
            return cell ? (<div><Check color="#008495" size={22}/></div>) : (<div><X color="#CB2334" size={22}/></div>)            
        },                   
        filter: textFilter({            
            disabled: "true",
            placeholder: "-"
        }),
        headerFormatter: headerFormatter          
    },             
];


class ExamRegistrations extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            editModalShow: false,
            addModalShow: false,            
            selectedRowsIds: []
        };
        this.handleShowAddParticipantModal = this.handleShowAddParticipantModal.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);

        this.crudTableRef = React.createRef();
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

    handleDeleteItem()
    {   
        const t = this.props.t;

        if ( this.state.selectedRowsIds.length == 1 )
        {
            if ( !window.confirm(t("are_you_sure")) )
                return;

            fetch(EXAM_REGISTRATIONS + "/" + this.state.selectedRowsIds[0], {
                method: "DELETE",
                headers : {
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
        const t = this.props.t;

        columns[Columns.FULL_NAME] = {...columns[Columns.FULL_NAME], text: t("full_name"), filter: textFilter({ placeholder: t("enter_full_name")})};
        columns[Columns.EMAIL] = {...columns[Columns.EMAIL], text: t("email"), filter: textFilter({ placeholder: t("enter_email")})};
        columns[Columns.CLUB] = {...columns[Columns.CLUB], text: t("club"), filter: textFilter({ placeholder: t("enter_club")})};
        columns[Columns.FEE_RECEIVED] = {...columns[Columns.FEE_RECEIVED], text: t("fee_received")};
        columns[Columns.PARTICIPATION_ACCEPTED] = {...columns[Columns.PARTICIPATION_ACCEPTED], text: t("participation_accepted")};

        const EXAM_REGISTRATIONS_FOR_EXAM = Urls.WEBSERVICE_URL + "/exam_events/" + this.props.id + "/exam_registrations";

        return(            
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <div>
                    <EditExamRegistrationModal  show={this.state.editModalShow}
                                                onHide={() => {
                                                    this.setState({ editModalShow: false, selectedRowsIds: [] });
                                                    this.crudTableRef.current.unselectAllRows();
                                                    this.crudTableRef.current.fillTable();
                                                }}
                                                itemId={this.state.selectedRowsIds[0]}
                    />
                    <AddParticipantToExamModal  show={this.state.addModalShow}
                                                onHide={() => {
                                                    this.setState({ addModalShow: false, selectedRowsIds: [] });
                                                    this.crudTableRef.current.unselectAllRows();
                                                    this.crudTableRef.current.fillTable();                                                    
                                                }}
                                                itemId={this.state.selectedRowsIds[0]}
                                                eventId={this.props.id}                                                
                    /> 
                    <Card>                        
                        <Card.Body>
                            <Card.Text>
                                <CrudTableComponent itemsUrl={EXAM_REGISTRATIONS_FOR_EXAM} 
                                                    tableColumns={columns} 
                                                    selectedItemId={this.handleRowClick}
                                                    selectedIds={this.handleRowSelection}
                                                    ref={this.crudTableRef}
                                />
                            </Card.Text>
                        </Card.Body>                        
                    </Card>                    
                </div>
            ): (<h2>You do not have priviledges  granted to view this section.</h2 >)
        );
    }
}

export default withTranslation('translation', { withRef: true })(ExamRegistrations);