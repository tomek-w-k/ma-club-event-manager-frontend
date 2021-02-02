import React, {Component} from "react";
import {
    Modal,     
    Button,   
} from "react-bootstrap";
import AuthService from "../service/auth-service";


const currentUser = AuthService.getCurrentUser();


class ConfirmationDialogModal extends Component
{
    constructor(props)
    {
        super(props);              
    }

    render()
    {  
        return (
            currentUser != null ?
            (
                <Modal 
                    show={this.props.show}                
                    onHide={this.props.onHide}
                    onEnter={this.loadItemToUpdate}
                    animation="true"
                    size="lg"
                    centered="true"                
                >                
                    <Modal.Header>
                        {this.props.modalTitle ? this.props.modalTitle : "CONFIRMATION"}
                    </Modal.Header>
                    <Modal.Body>
                        {this.props.modalContent ? this.props.modalContent : "Are you sure?"}
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <Button variant="info"                                 
                                    onClick={() => {
                                        this.props.onHide();
                                        this.props.confirmationResult(true);
                                    }}                                
                            >Yes</Button>{' '}                            
                            <Button variant="secondary" 
                                    onClick={() => {
                                        this.props.onHide();
                                        this.props.confirmationResult(false);
                                    }}
                            >No</Button>
                        </div>
                    </Modal.Footer>                
                </Modal>
            ): (<h2>You do not have priviledges  granted to view this section.</h2 > )
        );
    }
}

export default ConfirmationDialogModal;