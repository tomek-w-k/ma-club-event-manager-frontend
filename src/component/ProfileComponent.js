import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import AuthService from "../service/auth-service";


class ProfileComponent extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const currentUser = AuthService.getCurrentUser();

        return(
            currentUser != null ?
            (
                <div>
                    <Card>
                        <Card.Body>
                            <Card.Title>User's Profile</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{currentUser.email}</Card.Subtitle>
                            <br />
                            <Card.Text>
                                <tr>
                                    <td style={{paddingRight: "100px"}}>Token</td>
                                    <td>
                                        {currentUser.accessToken.substring(0, 20)} ...{" "}
                                        {currentUser.accessToken.substr(currentUser.accessToken.length-20)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Id</td>
                                    <td>{currentUser.id}</td>
                                </tr>
                                <tr>
                                    <td>Authorities</td>
                                    <td>
                                        {currentUser.roles &&
                                        currentUser.roles.map( role => <div>{role}</div> )}
                                    </td>
                                </tr>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            ) :
            ( <h2>You have no priviledges granted to view Profile component.</h2> )
        ); 
    }
}

export default ProfileComponent;