import React, {Component} from "react";
import {Card, Button} from "react-bootstrap";


class ExamHelp extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <Card>
                <Card.Header>
                    <div className="d-flex">
                        <div style={{display: "flex", alignItems: "center"}}>HELP</div>                        
                        <Button className="ml-auto" variant="secondary" onClick={this.props.toggleHelpSectionHandler}>Hide</Button>
                    </div>     
                </Card.Header>
                <Card.Body>                    
                    <Card.Text>
                        This is a help section for the Exam component.
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

export default ExamHelp;