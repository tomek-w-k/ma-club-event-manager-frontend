import React, {Component} from "react";
import {
    Modal,     
    Button,   
} from "react-bootstrap";
import { withTranslation } from "react-i18next";
import AuthService from "../service/auth-service";


const currentUser = AuthService.getCurrentUser();


class InformationDialogModal extends Component
{
    constructor(props)
    {
        super(props);              
    }

    render()    
    {  
        const t = this.props.t;

        return (            
            <Modal 
                show={this.props.show}                
                onHide={this.props.onHide}
                onEnter={this.loadItemToUpdate}
                animation="true"
                size="lg"
                centered="true"                
            >                
                <Modal.Header>
                    {this.props.modalTitle ? this.props.modalTitle : t("information_capital")}
                </Modal.Header>
                <Modal.Body>
                    {this.props.modalContent ? this.props.modalContent : t("are_you_sure")}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="info" onClick={() => this.props.onHide()} >Ok</Button>                            
                </Modal.Footer>                
            </Modal>            
        );
    }
}

export default withTranslation()(InformationDialogModal);