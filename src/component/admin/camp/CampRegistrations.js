import React, {Component} from "react";
import CrudTableComponent from "../../CrudTableComponent";
import {
    Card,    
    Button,    
    Accordion,
    Alert
} from "react-bootstrap";
import { textFilter } from 'react-bootstrap-table2-filter';
import {Check, SortUp, X} from "react-bootstrap-icons";
import EditCampRegistrationModal from "./EditCampRegistrationModal";
import AddParticipantToCampModal from "./AddParticipantToCampModal";
import { withTranslation } from "react-i18next";
import AuthService from "../../../service/auth-service";
import * as Urls from "../../../servers-urls";


const CAMP_REGISTRATIONS = Urls.WEBSERVICE_URL + "/camp_registrations";
const CAMP_EVENTS = Urls.WEBSERVICE_URL + "/camp_events";

const Columns = Object.freeze ({
    ID: 0,
    FULL_NAME: 1,
    EMAIL: 2,    
    CLUB: 3,
    FEE_RECEIVED: 4,
    SAYONARA: 5,
    CLOTHING_SIZE: 6,
    ACCOMMODATION: 7,
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
        dataField: "sayonaraMeetingParticipation", 
        text: "Sayonara",
        hidden: true,
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
        dataField: "clothingSize.clothingSizeName",
        text: "Clothing size",
        sort: true, 
        filter: textFilter(),
        style: (colum, colIndex) => {
            return { width: '10%', textAlign: 'center' };
        },
        headerStyle:  { "text-align": "center" },
        formatter: (cell, row) => {
            if (typeof cell == "undefined" )
                return "-"
            else return cell;
        }
    },
    { 
        dataField: "accommodation",
        text: "Accommodation",
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


class CampRegistrations extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            editModalShow: false,
            addModalShow: false,            
            selectedRowsIds: [],            
            sayonaraMeeting: false
        };
               
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);

        this.crudTableRef = React.createRef();
    }

    componentDidMount()
    {
        fetch(CAMP_EVENTS + "/" + this.props.id)
        .then(response => response.json())        
        .then(data => {
            let sayonaraColumnDef = Object.assign(columns[5], { hidden: !data.sayonaraMeeting });            
            columns[5] = sayonaraColumnDef;
            this.setState({ sayonaraMeeting: data.sayonaraMeeting });
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

    handleDeleteItem()
    {
        const t = this.props.t;
        
        if ( this.state.selectedRowsIds.length == 1 )
        {
            if ( !window.confirm("Are you sure?") )
                return;

            fetch(CAMP_REGISTRATIONS + "/" + this.state.selectedRowsIds[0], {
                method: "DELETE",
                header : {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
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
        const currentUser = AuthService.getCurrentUser();
        const CAMP_REGISTRATIONS_FOR_CAMP = Urls.WEBSERVICE_URL + "/camp_events/" + this.props.id + "/camp_registrations";
        const t = this.props.t;

        columns[Columns.FULL_NAME] = {...columns[Columns.FULL_NAME], text: t("full_name"), filter: textFilter({ placeholder: t("enter_full_name")})};
        columns[Columns.EMAIL] = {...columns[Columns.EMAIL], text: t("email"), filter: textFilter({ placeholder: t("enter_email")})};
        columns[Columns.CLUB] = {...columns[Columns.CLUB], text: t("club"), filter: textFilter({ placeholder: t("enter_club")})};
        columns[Columns.FEE_RECEIVED] = {...columns[Columns.FEE_RECEIVED], text: t("fee_received")};
        columns[Columns.SAYONARA] = {...columns[Columns.SAYONARA], text: t("sayonara")};
        columns[Columns.CLOTHING_SIZE] = {...columns[Columns.CLOTHING_SIZE], text: t("clothing_size"), filter: textFilter({ placeholder: t("enter_clothing_type")})};
        columns[Columns.ACCOMMODATION] = {...columns[Columns.ACCOMMODATION], text: t("accommodation")};

        
        return(            
            currentUser != null && currentUser.roles.includes("ROLE_ADMIN") ?
            (
                <div>
                    <EditCampRegistrationModal  show={this.state.editModalShow}
                                                onHide={() => {
                                                    this.setState({ editModalShow: false, selectedRowsIds: [] });
                                                    this.crudTableRef.current.unselectAllRows();
                                                    this.crudTableRef.current.fillTable();
                                                    this.props.onRegistrationUpdate();
                                                }}
                                                itemId={this.state.selectedRowsIds[0]}
                                                eventId={this.props.id}
                    />              
                    <AddParticipantToCampModal  show={this.state.addModalShow}
                                                onHide={() => {
                                                    this.setState({ addModalShow: false, selectedRowsIds: [] });
                                                    this.crudTableRef.current.unselectAllRows();
                                                    this.crudTableRef.current.fillTable();                                                    
                                                }}
                                                itemId={this.state.selectedRowsIds[0]}
                                                eventId={this.props.id}
                                                sayonaraMeeting={this.state.sayonaraMeeting}
                    /> 
                    <Accordion defaultActiveKey="0">
                    <Card>
                        {/* style={{backgroundColor: "#EAECEE"}} */}
                        <Card.Header >
                            <div className="d-flex">
                                <div style={{display: "flex", alignItems: "center"}}>{t("participants")}</div>
                                <Accordion.Toggle className="ml-auto" as={Button} variant="secondary" eventKey="0">{t("show_hide")}</Accordion.Toggle>
                            </div> 
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <Card.Text>
                                <CrudTableComponent itemsUrl={CAMP_REGISTRATIONS_FOR_CAMP} 
                                                    tableColumns={columns} 
                                                    selectedItemId={this.handleRowClick}
                                                    selectedIds={this.handleRowSelection}
                                                    ref={this.crudTableRef}
                                />
                            </Card.Text>
                        </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    </Accordion>
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

export default withTranslation('translation', { withRef: true })(CampRegistrations);