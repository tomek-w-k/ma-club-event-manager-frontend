import React, {Component} from "react";
import {
    Modal, 
    Form,
    Button,
    Row
} from "react-bootstrap";


const EXAM_REGISTRATIONS = "http://localhost:8081/exam_registrations"; 


class EditExamRegistrationModal extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            itemToUpdate: {
                id: null,
                user: {
                    id: null,
                    fullName: "",
                    email: "",
                    password: "",
                    country: "",
                    roles: [],
                    rank: "",
                    club: "",
                    branchChief: ""
                },
                feeReceived: undefined,
                participationAccepted: undefined
            }
        }
        this.loadItemToUpdate = this.loadItemToUpdate.bind(this);
        this.handleUpdateRegistration = this.handleUpdateRegistration.bind(this);
    }

    loadItemToUpdate()
    {
        fetch(EXAM_REGISTRATIONS + "/" + this.props.itemId)
        .then(response => response.json())
        .then(data => this.setState({ itemToUpdate: data } ));        
    }

    handleUpdateRegistration(e)
    {
        e.preventDefault();
        fetch(EXAM_REGISTRATIONS, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state.itemToUpdate)           
        })
        .then(response => response.json())
        .then(result => {            
            this.props.onHide();
        },
        error => {
            console.log("not updated");
        });
    }

    render()
    {
        return (
            <Modal 
                show={this.props.show}
                onHide={this.props.onHide}
                onEnter={this.loadItemToUpdate}
                animation="true"
                size="lg"
                centered="true"                
            >
                <Form onSubmit={this.handleUpdateRegistration}>
                    <Modal.Header>
                        {this.state.itemToUpdate.user.fullName}
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">Fee received</Form.Label>
                            <Form.Check 
                                type="checkbox"
                                name="feeReceived" 
                                style={{display: "flex", alignItems: "center"}}
                                checked={this.state.itemToUpdate.feeReceived}
                                onChange={e => { this.setState({ itemToUpdate: {...this.state.itemToUpdate, feeReceived: e.target.checked} }) }}
                            />
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">Consent to participate</Form.Label>
                            <Form.Check
                                type="checkbox"
                                name="participationAccepted" 
                                style={{display: "flex", alignItems: "center"}}
                                checked={this.state.itemToUpdate.participationAccepted}
                                onChange={e => { this.setState({ itemToUpdate: {...this.state.itemToUpdate, participationAccepted: e.target.checked} }) }}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <Button variant="info" onClick={this.props.onHide} type="submit">Save</Button>{' '}                            
                            <Button variant="secondary" onClick={this.props.onHide}>Cancel</Button>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    }
}

export default EditExamRegistrationModal;