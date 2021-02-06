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


const CLUB_DOCUMENTS_URL = Urls.WEBSERVICE_URL + "/club_documents";

const Columns = Object.freeze ({
    ID: 0,
    DESCRIPTION: 1,
    FILE_NAME: 2,    
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
        dataField: "clubDocumentDescription",
        text: "Description",
        sort: true, 
        filter: textFilter(),
        headerFormatter: headerFormatter
    },
    {
        dataField: "clubDocumentPath", 
        text: "File name",
        sort: false,        
        filter: textFilter(),
        formatter: (cell, row) => { return cell.split('\\').pop().split('/').pop() },
        headerFormatter: headerFormatter
    }          
];


class ClubDocuments extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            selectedRowsIds: null
        }
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.handleDeleteClubDocument = this.handleDeleteClubDocument.bind(this);

        this.crudTableRef = React.createRef();
    }

    handleRowClick(selectedRowId)
    {
        this.setState({
            selectedRowsIds: selectedRowId
        });

        this.props.history.push("/club_document_component/" + selectedRowId[0]);
    }

    handleRowSelection(selectedRows)
    {
        this.setState({
            selectedRowsIds: selectedRows
        });
    }

    handleDeleteClubDocument()
    {   
        const t = this.props.t;
        
        if ( this.state.selectedRowsIds != null && this.state.selectedRowsIds.length == 1 )
        {
            if ( !window.confirm("Are you sure?") )										
		        return;
            
            fetch(CLUB_DOCUMENTS_URL + "/" + this.state.selectedRowsIds[0], {
                method: "DELETE",
                header : {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            })
            .then(result => {
                let formData = new FormData();
                formData.append("dir", "/club_documents/" + this.state.selectedRowsIds[0]);

                fetch(Urls.EXPRESS_JS_URL + "/clear_dir", {
                    method: "DELETE",
                    body: formData
                })
                .then(() => { console.log("Club document directory removed.") });
                
                this.setState({ selectedRowsIds: [] });
                this.crudTableRef.current.unselectAllRows();
                this.crudTableRef.current.fillTable();
            },
            error => {
                console.log("Item not deleted");
            })
        }            
        else alert(t("select_one_document_to_remove"));
    }

    render()
    {
        const currentUser = AuthService.getCurrentUser();
        const t = this.props.t;

        columns[Columns.DESCRIPTION] = {...columns[Columns.DESCRIPTION], text: t("description"), filter: textFilter({ placeholder: t("enter_description")})};
        columns[Columns.FILE_NAME] = {...columns[Columns.FILE_NAME], text: t("file_name"), filter: textFilter({ placeholder: t("enter_file_name")})};
        
        this.props.navbarControlsHandler();

        return(
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            ( 
                <div>
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                <CrudTableComponent itemsUrl={CLUB_DOCUMENTS_URL}
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

export default withTranslation('translation', { withRef: true })(ClubDocuments);