import React, {Component} from "react";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css";

import LoginComponent from "./component/security/LoginComponent";
import SignUpComponent from "./component/security/SignUpComponent";
import ProfileComponent from "./component/ProfileComponent";

import AuthService from "./service/auth-service";

import './App.css';


class App extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			currentUser: undefined,
			showProfileComponent: false,			
		};
		this.logout = this.logout.bind(this);		
	}

	componentDidMount()
	{
		const user = AuthService.getCurrentUser();

		if ( user )
		{
			this.setState({
				currentUser: user,				
				showProfileComponent: user.roles.includes("ROLE_USER"),
			});
		}
	}

	logout()
	{
		AuthService.logout().then(
			() => window.location.reload()
		);
	}
	
	render()
	{
		const {
			currentUser,			
			showProfileComponent,
		} = this.state;
		
		return(
			<Router>
				<div class="main">
					<Navbar bg="dark" variant="dark">
						<Navbar.Brand>EventManager</Navbar.Brand>
						<Nav className="mr-auto" >							
							{showProfileComponent && ( <Link to="/profile_component" className="nav-link">Profile</Link> )}
						</Nav>
						<Nav>
							{currentUser ? ( 
								<div className="navbar-nav ml-auto">
									<li className="nav-item">
										<Link className="nav-link">{currentUser.email}</Link> 
									</li>									
									<li className="nav-item">
										{/* <a href="/login" className="nav-link" onClick={this.logout}>
											Logout
										</a> */}
										<Link to={"/login"} className="nav-link" onClick={this.logout}>
											Logout
										</Link>
									</li>
								</div>															
								) : (
								<div className="navbar-nav ml-auto">
									<li className="nav-item">
										<Link to={"/login"} className="nav-link" >
											Login
										</Link>
									</li>
									<li className="nav-item">
										<Link to={"/signup"} className="nav-link">
											Sign Up
										</Link>
									</li>
								</div>
							)}
						</Nav>						
					</Navbar>
					<div className="overflowable col-sm-12">
						<Switch>							
							<Route path="/profile_component" component={ProfileComponent} />
							<Route path="/login" component={LoginComponent} />
							<Route path="/signup" component={SignUpComponent} />
						</Switch>
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
