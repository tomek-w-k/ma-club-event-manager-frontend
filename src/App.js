import React, {Component} from "react";
import {BrowserRouter as Router, Switch, Route, Link, withRouter } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ToggleButton from "react-bootstrap/ToggleButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import {MDBIcon} from "mdbreact";

import LoginComponent from "./component/security/LoginComponent";
import SignUpComponent from "./component/security/SignUpComponent";

import People from "./component/admin/People";

import Exams from "./component/admin/exam_event/Exams";
import Exam from "./component/admin/exam_event/Exam";
import AddExam from "./component/admin/exam_event/AddExam";

import Camps from "./component/admin/camp/Camps";
import Camp from "./component/admin/camp/Camp";
import AddCamp from "./component/admin/camp/AddCamp";

import Tournaments from "./component/admin/tournament/Tournaments";
import Tournament from "./component/admin/tournament/Tournament";
import AddTournament from "./component/admin/tournament/AddTournament";

import Profile from "./component/Profile";
import EventWall from "./component/EventWall";

import AuthService from "./service/auth-service";

import './App.css';
import ichibanDojoLogo from "./resources/images/ichiban_logo.png";



const toggleLanguageRadios = [
	{ name: 'PL', value: '1' },
	{ name: 'EN', value: '2' },
];


class App extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			currentUser: undefined,
			showAdministrativeTools: false,
			showUsersTools: false,
			toggleLanguageRadioValue: '2',
		};
		this.logout = this.logout.bind(this);
		this.deselectAllComponents = this.deselectAllComponents.bind(this);

		this.examsRef = React.createRef();
		this.examRef = React.createRef();
		this.campsRef = React.createRef();
		this.campRef = React.createRef();
		this.tournamentsRef = React.createRef();
		this.tournamentRef = React.createRef();
	}

	componentDidMount()
	{
		const user = AuthService.getCurrentUser();

		if ( user )
		{
			this.setState({
				currentUser: user,	
				showAdministrativeTools: user.roles.includes("ROLE_ADMIN"),
				showUsersTools: user.roles.includes("ROLE_USER"),
				toggleLanguageRadioValue: '2',
			});

			this.deselectAllComponents();
		}
	}

	logout()
	{
		AuthService.logout().then(
			() => window.location.reload()
		);
	}
	
	deselectAllComponents()
	{
		this.setState({			
			peopleComponentSelected: false,

			examsComponentSelected: false,
			examComponentSelected: false,
			addExamComponentSelected: false,

			campsComponentSelected: false,
			campComponentSelected: false,
			addCampComponentSelected: false,

			tournamentsComponentSelected: false,
			tournamentComponentSelected: false,
			addTournamentComponentSelected: false,

			profileComponentSelected: false,
			eventWallComponentSelected: false,
		})
	}

	render()
	{
		return(			
			<div>
				<div className="sidenav">
					<div className="club-logo">
						<img src={ichibanDojoLogo} style={{width: "100%", height: "100%", objectFit: "contain", padding: "4px"}} />							
					</div>						
					<Nav className="flex-column" >
						{this.state.showAdministrativeTools && (
							<div>
								<div style={{fontSize: "small", paddingLeft:"10px", paddingTop:"20px"}}>ADMINISTRATIVE TOOLS</div>
								<Link to="/people_component" className="nav-link sidenav-text" style={{color:"black"}} >People</Link>
								<Link to="/exams_component" className="nav-link sidenav-text" style={{color:"black"}} >Exams</Link>
								<Link to="/camps_component" className="nav-link sidenav-text" style={{color:"black"}} >Camps</Link>
								<Link to="/tournaments_component" className="nav-link sidenav-text" style={{color:"black"}} >Tournaments</Link>
								<div style={{fontSize: "small", paddingLeft:"10px", paddingTop:"20px"}}>USER'S TOOLS</div>
							</div>							
						)}	
						{this.state.showUsersTools && (
							<div>
								<Link to="/profile_component" className=" nav-link sidenav-text" style={{color:"black"}} >Profile</Link>
								<Link to="/event_wall_component" className="nav-link sidenav-text" style={{color:"black"}} >Events</Link>
							</div>
						)}
					</Nav>
				</div>
				<div className="main">
					<div className="topnav">	
					<Navbar bg="dark" variant="dark" >
						<Navbar.Brand>
							{this.state.peopleComponentSelected && (<div>People</div>)}

							{this.state.examsComponentSelected && (<div>Exams</div>)}
							{this.state.examComponentSelected && (<div>Exam</div>)}
							{this.state.addExamComponentSelected && (<div>New Exam</div>)}

							{this.state.campsComponentSelected && (<div>Camps</div>)}
							{this.state.campComponentSelected && (<div>Camp</div>)}
							{this.state.addCampComponentSelected && (<div>New Camp</div>)}

							{this.state.tournamentsComponentSelected && (<div>Tournaments</div>)}
							{this.state.tournamentComponentSelected && (<div>Tournament</div>)}

							{this.state.profileComponentSelected && (<div>Profile</div>)}
							{this.state.eventWallComponentSelected && (<div>Events</div>)}
						</Navbar.Brand>
						<Nav className="mr-auto" ></Nav>
						<Nav>
							{this.state.currentUser ? ( 
								<div className="navbar-nav ml-auto" style={{display: "flex", alignItems: "center"}}>
									<li className="nav-item"><Link className="btn btn-outline-secondary btn-sm">{this.state.currentUser.email}</Link></li>
									<div style={{width: "10px"}}></div>
									<li className="nav-item"><Link to={"/login"} className="btn btn-secondary btn-sm" onClick={this.logout}>Logout</Link></li>
								</div>															
								) : ( 
								<div className="navbar-nav ml-auto">
									<li className="nav-item"><Link to={"/login"} className="nav-link" >Login</Link></li>
									<li className="nav-item"><Link to={"/signup"} className="nav-link">Sign Up</Link></li>
								</div>
							)}								
						</Nav>
						<Nav><div style={{width: "10px"}}></div></Nav>
						<Nav>
							<ButtonGroup toggle >
								{toggleLanguageRadios.map((radio, idx) => (
									<ToggleButton
										key={idx}
										type="radio"
										variant="secondary"
										size="sm"
										name="radio"
										value={radio.value}
										checked={this.state.toggleLanguageRadioValue === radio.value}
										onChange={(e) => (this.setState({ toggleLanguageRadioValue: e.currentTarget.value }))}
									>{radio.name}</ToggleButton>
								))}
							</ButtonGroup>
							<div style={{width: "10px"}}></div>
							{this.state.examComponentSelected && (<Button onClick={this.examRef.current.toggleHelpSection} variant="secondary" size="sm">Help</Button>)}							
						</Nav>																		
					</Navbar>	
					<Navbar bg="white" variant="light">
						<Nav  style={{backgroundColor: "white", width: "100%"}}>				
						{this.state.peopleComponentSelected && (
							<div>
								<Button href="#" variant="info">New</Button>{' '}
								<Button href="#" variant="danger">Remove</Button>
							</div>							
						)}
						{this.state.examsComponentSelected && (
							<div>								
								<Link to="/add_exam_component" className="btn btn-info">New Exam</Link>{' '}
								<Button variant="danger" onClick={() => { this.examsRef.current.handleDeleteExam() }}>Remove</Button>
							</div>							
						)}
						{this.state.examComponentSelected && (
							<div>								
								<Button onClick={() => { this.examRef.current.handleAddRegistration() }} variant="info">Add participnat...</Button>{' '}
								<Button onClick={() => { this.examRef.current.handleDeleteRegistration() }} variant="danger">Remove participant</Button>								
							</div>							
						)}
						{this.state.addExamComponentSelected && (
							<div>
								<Button href="/add_exam_component" variant="secondary">Clear form</Button>							
							</div>							
						)}
						{this.state.campsComponentSelected && (
							<div>								
								<Link to="/add_camp_component" className="btn btn-info">New Camp</Link>{' '}
								<Button variant="danger" onClick={() => { this.campsRef.current.handleDeleteCamp() }}>Remove</Button>
							</div>							
						)}
						{this.state.campComponentSelected && (
							<div>								
								<Button onClick={() => { this.campRef.current.handleAddRegistration() }} variant="info">Add participnat...</Button>{' '}
								<Button onClick={() => { this.campRef.current.handleDeleteRegistration() }} variant="danger">Remove participant</Button>
							</div>							
						)}
						{this.state.addCampComponentSelected && (
							<div>
								<Button href="/add_camp_component" variant="secondary">Clear form</Button>							
							</div>	
						)}
						{this.state.tournamentsComponentSelected && (
							<div>								
								<Link to="/add_tournament_component" className="btn btn-info">New Tournament</Link>{' '}
								<Button variant="danger" onClick={() => { this.tournamentsRef.current.handleDeleteTournament() }}>Remove</Button>
							</div>							
						)}
						{this.state.tournamentComponentSelected && (
							<div>								
								<Button onClick={() => { this.tournamentRef.current.handleAddRegistration() }} variant="info">Add participnat...</Button>{' '}
								<Button onClick={() => { this.tournamentRef.current.handleDeleteRegistration() }} variant="danger">Remove participant</Button>
							</div>							
						)}
						{this.state.addTournamentComponentSelected && (
							<div>
								<Button href="/add_tournament_component" variant="secondary">Clear form</Button>							
							</div>	
						)}
						{this.state.profileComponentSelected && (
							<div>
								<Button href="#" variant="danger">Remove my account</Button>
							</div>
						)}
						{this.state.eventWallComponentSelected && (
							<Form >
								<Form.Row>
									<Col><Form.Control type="text" placeholder="Search"  /></Col>
									<Col><Button type="submit" variant="info">Search</Button></Col>									
								</Form.Row>								
							</Form>							
						)}
						</Nav>
						<Nav className="ml-auto">
							<Link className="nav-link"><MDBIcon fab icon="facebook-f" /></Link>
							<Link className="nav-link"><MDBIcon fab icon="youtube" /></Link>
							<Link className="nav-link"><MDBIcon fab icon="instagram" /></Link>
						</Nav>
					</Navbar>					
					</div>
					<div className="content">
						<Switch>							
							<Route path="/login" component={LoginComponent} />
							<Route path="/signup" component={SignUpComponent} />

							<Route path="/profile_component" render={(props) => (<Profile {...props} navbarControlsHandler={() => {
								if ( !this.state.profileComponentSelected ) {
									this.deselectAllComponents();
									this.setState({ profileComponentSelected: true });
								}									
							}} />)} />
							<Route path="/event_wall_component" render={(props) => (<EventWall {...props} navbarControlsHandler={() =>{
								if ( !this.state.eventWallComponentSelected ) {
									this.deselectAllComponents();
									this.setState({ eventWallComponentSelected: true });
								}
							}} />)} />
							{this.state.showAdministrativeTools && (
								<div>
									<Route path="/people_component" render={(props) => (<People {...props} navbarControlsHandler={() => {
										if ( !this.state.peopleComponentSelected )
										{
											this.deselectAllComponents();
											this.setState({ peopleComponentSelected: true });
										}
									}} />)} />
									<Route path="/exams_component" render={(props) => (<Exams {...props} ref={this.examsRef} navbarControlsHandler={() => {
										if ( !this.state.examsComponentSelected )
										{
											this.deselectAllComponents();
											this.setState({ examsComponentSelected: true });
										}
									}} />)} />
									<Route path="/exam_component/:id" render={(props) => (<Exam {...props} ref={this.examRef} navbarControlsHandler={() => {
										if ( !this.state.examComponentSelected ) {
											this.deselectAllComponents();
											this.setState({ examComponentSelected:  true });
										}
									}} /> )} />
									<Route path="/add_exam_component" render={(props) => (<AddExam {...props} navbarControlsHandler={() => {
										if ( !this.state.addExamComponentSelected )
										{
											this.deselectAllComponents();
											this.setState({ addExamComponentSelected: true });
										}
									}} />)} />
									<Route path="/camps_component" render={(props) => (<Camps {...props} ref={this.campsRef} navbarControlsHandler={() => {
										if ( !this.state.campsComponentSelected )
										{
											this.deselectAllComponents();
											this.setState({ campsComponentSelected: true });
										}
									}} />)} />
									<Route path="/camp_component/:id" render={(props) => (<Camp {...props} ref={this.campRef} navbarControlsHandler={() => {
										if ( !this.state.campComponentSelected )
										{
											this.deselectAllComponents();
											this.setState({ campComponentSelected: true });											
										}
									}} />)} />
									<Route path="/add_camp_component" render={(props) => (<AddCamp {...props} navbarControlsHandler={() => {
										if ( !this.state.addCampComponentSelected )
										{
											this.deselectAllComponents();
											this.setState({ addCampComponentSelected: true });
										}
									}} />)} />
									<Route path="/tournaments_component" render={(props) => (<Tournaments {...props} ref={this.tournamentsRef} navbarControlsHandler={() => {
										if ( !this.state.tournamentsComponentSelected )
										{
											this.deselectAllComponents();
											this.setState({ tournamentsComponentSelected: true });
										}
									}} />)} />
									<Route path="/tournament_component/:id" render={(props) => (<Tournament {...props} ref={this.tournamentRef} navbarControlsHandler={() => {
										if ( !this.state.tournamentComponentSelected )
										{
											this.deselectAllComponents();
											this.setState({ tournamentComponentSelected: true });											
										}
									}} />)} />
									<Route path="/add_tournament_component" render={(props) => (<AddTournament {...props} navbarControlsHandler={() => {
										if ( !this.state.addTournamentComponentSelected )
										{
											this.deselectAllComponents();
											this.setState({ addTournamentComponentSelected: true });
										}
									}} />)} />
								</div>								
							)}														
						</Switch>
					</div>
				</div>
			</div>			
		);
	}
}

export default withRouter(App);
//export default App;
