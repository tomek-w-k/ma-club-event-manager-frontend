import React, {Component} from "react";
import CrudTableComponent from "../../CrudTableComponent";
import {Card} from "react-bootstrap";
import {textFilter} from 'react-bootstrap-table2-filter';
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";
import { ColumnNames } from "./campsTableColumnDefs";
import { campsTableColumnDefs as columns } from "./campsTableColumnDefs"


const currentUser = AuthService.getCurrentUser();
const CAMP_EVENTS_URL = Urls.WEBSERVICE_URL + "/camp_events";
const EVENTS_API_URL = Urls.WEBSERVICE_URL + "/events";


class CampsComponent extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            selectedRowsIds: null
        }
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.handleDeleteCamp = this.handleDeleteCamp.bind(this);

        this.crudTableRef = React.createRef();
    }

    handleRowClick(selectedRowId)
    {
        this.setState({
            selectedRowsIds: selectedRowId
        });

        this.props.history.push("/camp_component/" + selectedRowId[0]);
    }

    handleRowSelection(selectedRows)
    {
        this.setState({
            selectedRowsIds: selectedRows
        });
    }

    handleDeleteCamp()
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
                let formData = new FormData();
                formData.append("dir", "/images/camps/" + this.state.selectedRowsIds[0]);

                fetch(Urls.EXPRESS_JS_URL + "/clear_dir", {
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + currentUser.accessToken
                    },
                    body: formData
                })
                .then(() => { 
                    this.setState({ selectedRowsIds: [] });
                    this.crudTableRef.current.unselectAllRows();
                    this.crudTableRef.current.fillTable();    
                });
            },
            error => console.log("Item not deleted"))
        }            
        else alert(t("select_one_camp_to_remove"));
    }

    render()
    {
        const t = this.props.t;

        columns[ColumnNames.CAMP_NAME] = {...columns[ColumnNames.CAMP_NAME], text: t("camp"), filter: textFilter({ placeholder: t("enter_camp_name")})};
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
                                <CrudTableComponent itemsUrl={CAMP_EVENTS_URL}
                                                    tableColumns={columns} 
                                                    selectedItemId={this.handleRowClick} 
                                                    selectedIds={this.handleRowSelection}
                                                    ref={this.crudTableRef}
                                />             
                            </Card.Text>
                        </Card.Body>
                    </Card>                    
                </div>
            ) :
            ( <h2>You do not have priviledges  granted to view this section.</h2> )
        );
    }
}

export default withTranslation('translation', { withRef: true })(CampsComponent);