import React, {Component} from "react";
import CrudTableComponent from "../../CrudTableComponent";
import { Card } from "react-bootstrap";
import { textFilter } from 'react-bootstrap-table2-filter';
import EditExamRegistrationModal from "./EditExamRegistrationModal";
import AddParticipantToExamModal from "./AddParticipantToExamModal";
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";
import { ColumnNames } from "./examRegistrationsTableColumnDefs";
import { examRegistrationsTableColumnDefs as columns } from "./examRegistrationsTableColumnDefs";


const currentUser = AuthService.getCurrentUser();
const EXAM_REGISTRATIONS = Urls.WEBSERVICE_URL + "/exam_registrations";


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

        columns[ColumnNames.FULL_NAME] = {...columns[ColumnNames.FULL_NAME], text: t("full_name"), filter: textFilter({ placeholder: t("enter_full_name")})};
        columns[ColumnNames.EMAIL] = {...columns[ColumnNames.EMAIL], text: t("email"), filter: textFilter({ placeholder: t("enter_email")})};
        columns[ColumnNames.CLUB] = {...columns[ColumnNames.CLUB], text: t("club"), filter: textFilter({ placeholder: t("enter_club")})};
        columns[ColumnNames.FEE_RECEIVED] = {...columns[ColumnNames.FEE_RECEIVED], text: t("fee_received")};
        columns[ColumnNames.PARTICIPATION_ACCEPTED] = {...columns[ColumnNames.PARTICIPATION_ACCEPTED], text: t("participation_accepted")};

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