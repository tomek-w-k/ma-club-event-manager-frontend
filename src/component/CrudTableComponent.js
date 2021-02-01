import React, { Component } from "react";
import {
     Container,
     Row,
     Col,     
     Button
     } from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

//import "./../App.css";
//import AddItemModal from "./AddItemModal";
//import EditItemModal from "./EditItemModal";


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
            itemToUpdate: {
                id: null,
                firstName: null,
                lastName: null,
                dateOfBirth: null                
            },            
        }
        this.fillTable = this.fillTable.bind(this);  
        this.unselectAllRows = this.unselectAllRows.bind(this);
        // this.editSelectedItem = this.editSelectedItem.bind(this);
        // this.deleteSelectedItems = this.deleteSelectedItems.bind(this);       
    }
    
    fillTable()
    {        
        fetch(this.props.itemsUrl)
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

    // editSelectedItem()
    // {   
    //     if ( this.state.selectedRowsIds.length != 0 )
    //     {
    //         if ( this.state.selectedRowsIds.length == 1 )
    //         {
    //             fetch(this.props.itemsUrl + this.state.selectedRowsIds[0])
    //             .then(response => response.json())
    //             .then(data => {
    //                 this.setState({                
    //                     itemToUpdate: data,                        
    //                 }); 
    //                 console.log("item to update: " + this.state.itemToUpdate.id);       
    //             })
    //             .then(() => {
    //                 this.setState({
    //                     editItemModalShow: true,    
    //                 })
    //             });         
    //         }
    //         else alert("Please choose only one item to edit"); 
    //     }
    //     else alert("Please choose a item to edit");
    // }

    // deleteSelectedItems()
    // {   
    //     if ( this.state.selectedRowsIds.length != 0 )
    //     {
    //         Promise.all( 
    //             this.state.selectedRowsIds.map( (id) => {             
    //                 return fetch( this.props.itemsUrl + id, {
    //                    method: 'DELETE',
    //                    header: {'Accept':'application/json',
    //                             'Content-Type':'application/json', } 
    //                 } )
    //             } )
    //         )
    //         .then( (result) => {
    //             this.state.selectedRowsIds = [];
    //             this.fillTable();
    //         },
    //         (error) => {
    //             console.log("not deleted");
    //         } )
    //     } 
    //     else alert("Please select at least one item to delete");
    // }
   
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
            //this.editSelectedItem();            
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
                { option.text }
              </button>
            ))
          }
        </div>

        </>
      );
      
    const pagination = paginationFactory({
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
    }, )

    const emptyTableMessage = () => {
        return (
            <div style={{ textAlign: "center", marginTop: "50px", marginBottom: "50px" }}>                
                { this.props.emptyTableMessage && {}.toString.call( this.props.emptyTableMessage) === '[object Function]' ? 
                    this.props.emptyTableMessage() : "No data to display"}                
            </div>
        );
    }

    return (
    <div>
        {/* <div className="content"> */}
		{/* <Container fluid> */}
		  {/* <Row> */}
			{/* <Col md={12}> */}
			 
                {/* <div class="crud-button-group">                     
                    <Button variant="info" onClick={() => {this.setState({ addItemModalShow: true }) }}>New...</Button>{' '}
                    <Button variant="warning" onClick={() => {this.editSelectedItem()}}>Update...</Button>{' '}
                    <Button variant="danger" onClick={() => {this.deleteSelectedItems()}}>Remove</Button>                    
                </div>    */}
                
                
              
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
			{/* </Col> */}
		  {/* </Row> */}
		{/* </Container> */}
	  </div>
	);
  }
}

export default CrudTable;
