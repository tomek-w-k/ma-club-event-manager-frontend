import React, { Component } from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { withTranslation } from "react-i18next";
import {
    OverlayTrigger,
    Tooltip
} from "react-bootstrap";
import AuthService from "../service/auth-service";


const currentUser = AuthService.getCurrentUser();


class CrudTable extends Component
{    
    constructor(props)
	{
		super(props);
		this.state = {			
            items: [],             
            addItemModalShow: false,
            editItemModalShow: false,
            selectedRowsIds: [],                                          
        }
        this.fillTable = this.fillTable.bind(this);  
        this.unselectAllRows = this.unselectAllRows.bind(this);         
    }
    
    fillTable()
    {        
        fetch(this.props.itemsUrl, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + currentUser.accessToken                
            },
        })
        .then(response => response.json())
        .then(data => {
            this.setState({                
                items: data,                
            })
        });         
    }

    unselectAllRows()
    {
        this.setState({ selectedRowsIds: [] })
    }

    componentDidMount()
    {  
        this.fillTable();
    }
   
    render()
    {     
        const tableRowEvents = {
            onClick: (e, row, rowIndex) => {  
                if ( this.state.selectedRowsIds.length > 0  )
                    this.state.selectedRowsIds = [];   

                this.state.selectedRowsIds.push(row.id);                        
                this.props.selectedItemId(this.state.selectedRowsIds);                 
            }
        }

        const selectRow = {
            mode: "checkbox",
            style: { background: "lightgray" },
            clickToSelect: false,
            onSelect: (row, isSelect, rowIndex, e) => {
                if ( isSelect && !this.state.selectedRowsIds.includes(row.id))          
                    this.state.selectedRowsIds.push(row.id);            
                
                if ( !isSelect && this.state.selectedRowsIds.includes(row.id))
                    this.state.selectedRowsIds.splice(this.state.selectedRowsIds.indexOf(row.id), 1);

                this.props.selectedIds(this.state.selectedRowsIds);
            },
            onSelectAll: (isSelect, rows, e) => {            
                if ( isSelect )
                    this.state.selectedRowsIds = rows.map( (row) => {return row.id} );
                else
                    this.state.selectedRowsIds = [];
                
                this.props.selectedIds(this.state.selectedRowsIds);
            },        
            selected: this.state.selectedRowsIds,
        }

        const sizePerPageRenderer = ({
            options,
            currSizePerPage,
            onSizePerPageChange
            }) => (
            <>
                <div className="btn-group" role="group">
                    {
                        options.map(option => (
                            <button
                                key={ option.text }
                                type="button"
                                onClick={ () => onSizePerPageChange(option.page) }
                                className={ `btn ${currSizePerPage === `${option.page}` ? 'btn btn-primary btn-sm' : 'btn-secondary btn-sm'}` }
                            >
                            { option.text }</button>
                        ))
                    }
                </div>

            </>
        );
        
        const sizePerPageList = this.props.sizePerPageList ? 
            {...this.props.sizePerPageList, sizePerPageRenderer} :
            {
                sizePerPageList: [ 
                    {
                        text: '10th', value: 10
                    },
                    {
                        text: '15th', value: 15
                    },
                    {
                        text: '20th', value: 20
                    },
                    {
                        text: 'All', value: this.state.items.length
                    }
                ],
                sizePerPageRenderer
            }
        
        const pagination = paginationFactory(sizePerPageList, )

        const emptyTableMessage = () => {
            return (
                <div style={{ textAlign: "center", marginTop: "50px", marginBottom: "50px" }}>                
                    { this.props.emptyTableMessage && {}.toString.call( this.props.emptyTableMessage) === '[object Function]' ? 
                        this.props.emptyTableMessage() : "No data to display"}                
                </div>
            );
        }

        const t = this.props.t;

        return (
            <div> 
                <div className="d-flex flex-row-reverse" style={{marginBottom: "10px"}}>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>{t("saves_to_xls")}</Tooltip>} >
                        <div>
                            <ReactHTMLTableToExcel
                                id="test-table-xls-button"
                                className="btn btn-secondary btn-sm"
                                table="crudTable"
                                filename="tablexls"
                                sheet="tablexls"
                                buttonText={t("write_to_xls")}
                            />   
                        </div>
                    </OverlayTrigger> 
                </div>   
                <BootstrapTable     id="crudTable" 
                                    keyField='id'
                                    data={ this.state.items }
                                    columns={ this.props.tableColumns }
                                    bootstrap4 = { true }
                                    hover = { true }
                                    bordered = { false }
                                    rowEvents = { tableRowEvents }
                                    selectRow = { selectRow }
                                    filter = { filterFactory() }
                                    pagination = { pagination }  
                                    noDataIndication={emptyTableMessage}                                                                   
                >                    
                </BootstrapTable>			
            </div>
        );
    }
}

export default withTranslation('translation', { withRef: true })(CrudTable);
