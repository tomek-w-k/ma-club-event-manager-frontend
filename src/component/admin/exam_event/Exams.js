import React, {Component} from "react";
import CrudTableComponent from "../../CrudTableComponent";
import {
    Card,
    Alert
} from "react-bootstrap";
import {textFilter} from 'react-bootstrap-table2-filter';
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";
import { ColumnNames } from "./examsTableColumnDefs";
import { examsTableColumnDefs as columns} from "./examsTableColumnDefs";


const currentUser = AuthService.getCurrentUser();        
const EXAM_EVENTS_URL = Urls.WEBSERVICE_URL + "/exam_events";
const EVENTS_API_URL = Urls.WEBSERVICE_URL + "/events";


class Exams extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            selectedRowsIds: null
        }
        
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.handleDeleteExam = this.handleDeleteExam.bind(this);

        this.crudTableRef = React.createRef();
    }

    handleRowClick(selectedRowId)
    {
        this.setState({
            selectedRowsIds: selectedRowId
        });

        this.props.history.push("/exam_component/" + selectedRowId[0]);
    }

    handleRowSelection(selectedRows)
    {
        this.setState({
            selectedRowsIds: selectedRows
        });
    }

    handleDeleteExam()
    {   
        const t = this.props.t; 
        
        if ( this.state.selectedRowsIds != null && this.state.selectedRowsIds.length == 1 )
        {
            if ( !window.confirm("Are you sure?") )										
		        return;
            
            fetch(EVENTS_API_URL + "/" + this.state.selectedRowsIds[0], {
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
                console.log("Item not deleted");
            })
        }            
        else alert(t("select_one_exam_to_remove"));
    }

    render()
    {
        const t = this.props.t;

        columns[ColumnNames.EXAM_NAME] = {...columns[ColumnNames.EXAM_NAME], text: t("exam"), filter: textFilter({ placeholder: t("enter_exam_name")})};
        columns[ColumnNames.START_DATE] = {...columns[ColumnNames.START_DATE], text: t("start_date"), filter: textFilter({ placeholder: t("enter_start_date")})};
        columns[ColumnNames.PERSONS_SIGNED_IN] = {...columns[ColumnNames.PERSONS_SIGNED_IN], text: t("persons_registered")};

        this.props.navbarControlsHandler();
        
        return( 
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            ( 
                <div>
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                <CrudTableComponent itemsUrl={EXAM_EVENTS_URL} 
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

export default withTranslation('translation', { withRef: true })(Exams);