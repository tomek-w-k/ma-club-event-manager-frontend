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
import Login from "./component/security/Login";
import SignUp from "./component/security/SignUp";

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

import Teams from "./component/trainer/Teams";
import Team from "./component/trainer/Team";

import ClubDocuments from "./component/admin/club_document/ClubDocuments";
import ClubDocument from "./component/admin/club_document/ClubDocument";
import AddClubDocument from "./component/admin/club_document/AddClubDocument";

import Profile from "./component/Profile";
import EventWall from "./component/EventWall";
import Downloads from "./component/Downloads";

import LanguageSelect from "./component/LanguageSelect";
import { withTranslation } from "react-i18next";


import AuthService from "./service/auth-service";

import './App.css';
import ichibanDojoLogo from "./resources/images/ichiban_logo.png";

import {PersonPlusFill} from "react-bootstrap-icons";
import {PersonDashFill} from "react-bootstrap-icons";
import {PersonCheckFill} from "react-bootstrap-icons";


const user = AuthService.getCurrentUser();

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
			showTrainersTools: false,
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
		this.teamsRef = React.createRef();
		this.teamRef = React.createRef();
		this.clubDocumentsRef = React.createRef();
		this.clubDocumentRef = React.createRef();
	}

	componentDidMount()
	{
		if ( user )
		{
			this.setState({
				currentUser: user,	
				showAdministrativeTools: user.roles.includes("ROLE_ADMIN"),
				showUsersTools: user.roles.includes("ROLE_USER"),
				showTrainersTools: user.roles.includes("ROLE_TRAINER"),
				toggleLanguageRadioValue: '2',
			});
			
			this.deselectAllComponents();
		}

		document.title = "Ichiban Dojo";
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

			teamsComponentSelected: false,
			teamComponentSelected: false,			

			clubDocumentsComponentSelected: false,
			clubDocumentComponentSelected: false,
			addClubDocumentComponentSelected: false,

			profileComponentSelected: false,
			eventWallComponentSelected: false,
			downloadsComponentSelected: false,
		})
	}

	render()
	{
		let USER_TEAMS_ROUTE = user ? "/user/" + user.id + "/teams_component" : "";
		const t = this.props.t;

		return(			
			<div>
				<div className="sidenav">
					<div className="club-logo">
						<img src={ichibanDojoLogo} style={{width: "100%", height: "100%", objectFit: "contain", padding: "4px"}} />							
					</div>						
					<Nav className="flex-column" >
						{this.state.showAdministrativeTools && (
							<div>
								<div style={{fontSize: "small", paddingLeft:"10px", paddingTop:"20px"}}>{t("administrative_tools")}</div>
								<Link to="/people_component" className="nav-link sidenav-text" style={{color:"black"}} >{t("people")}</Link>
								<Link to="/exams_component" className="nav-link sidenav-text" style={{color:"black"}} >{t("exams")}</Link>
								<Link to="/camps_component" className="nav-link sidenav-text" style={{color:"black"}} >{t("camps")}</Link>
								<Link to="/tournaments_component" className="nav-link sidenav-text" style={{color:"black"}} >{t("tournaments")}</Link>
								<Link to="/club_documents_component" className="nav-link sidenav-text" style={{color:"black"}} >{t("documents")}</Link>
							</div>							
						)}
						{this.state.showTrainersTools && (
							<div>
								<div style={{fontSize: "small", paddingLeft:"10px", paddingTop:"20px"}}>{t("trainers_tools")}</div>
								<Link to={USER_TEAMS_ROUTE} className="nav-link sidenav-text" style={{color:"black"}} >{t("teams")}</Link>
								<div style={{fontSize: "small", paddingLeft:"10px", paddingTop:"20px"}}>{t("users_tools")}</div>
							</div>
						)}	
						{this.state.showUsersTools && (
							<div>
								<Link to="/profile_component" className=" nav-link sidenav-text" style={{color:"black"}} >{t("profile")}</Link>
								<Link to="/event_wall_component" className="nav-link sidenav-text" style={{color:"black"}} >{t("events")}</Link>
								<Link to="/downloads_component" className="nav-link sidenav-text" style={{color:"black"}} >{t("downloads")}</Link>
							</div>
						)}						
					</Nav>
				</div>
				<div className="main">
					<div className="topnav">	
					<Navbar bg="dark" variant="dark" >
						<Navbar.Brand>
							{this.state.peopleComponentSelected && (<div>{t("people")}</div>)}

							{this.state.examsComponentSelected && (<div>{t("exams")}</div>)}
							{this.state.examComponentSelected && (<div>{t("exam")}</div>)}
							{this.state.addExamComponentSelected && (<div>{t("new_exam")}</div>)}

							{this.state.campsComponentSelected && (<div>{t("camps")}</div>)}
							{this.state.campComponentSelected && (<div>{t("camp")}</div>)}
							{this.state.addCampComponentSelected && (<div>{t("new_camp")}</div>)}

							{this.state.tournamentsComponentSelected && (<div>{t("tournaments")}</div>)}
							{this.state.tournamentComponentSelected && (<div>{t("tournament")}</div>)}
							{this.state.addTournamentComponentSelected && (<div>{t("new_tournament")}</div>)}

							{this.state.clubDocumentsComponentSelected && (<div>{t("documents")}</div>)}
							{this.state.clubDocumentComponentSelected && (<div>{t("document")}</div>)}
							{this.state.addClubDocumentComponentSelected && (<div>{t("new_document")}</div>)}

							{this.state.teamsComponentSelected && (<div>{t("teams")}</div>)}
							{this.state.teamComponentSelected && (<div>{t("team")}</div>)}

							{this.state.profileComponentSelected && (<div>{t("profile")}</div>)}
							{this.state.eventWallComponentSelected && (<div>{t("events")}</div>)}
							{this.state.downloadsComponentSelected && (<div>{t("downloads")}</div>)}
						</Navbar.Brand>
						<Nav className="mr-auto" ></Nav>
						<Nav>
							{this.state.currentUser ? ( 
								<div className="navbar-nav ml-auto" style={{display: "flex", alignItems: "center"}}>
									<li className="nav-item"><Link className="btn btn-outline-secondary btn-sm">{this.state.currentUser.email}</Link></li>
									<div style={{width: "10px"}}></div>
									<li className="nav-item"><Link to={"/login/@"} className="btn btn-secondary btn-sm" onClick={this.logout}>{t("logout")}</Link></li>
								</div>															
								) : ( 
								<div className="navbar-nav ml-auto">
									<li className="nav-item"><Link to={"/login/@"} className="btn btn-secondary btn-sm" >{t("login")}</Link></li>
									<div style={{width: "10px"}}></div>
									<li className="nav-item"><Link to={"/signup"} className="btn btn-secondary btn-sm">{t("sign_up")}</Link></li>
								</div>
							)}								
						</Nav>
						<Nav><div style={{width: "10px"}}></div></Nav>
						<Nav><LanguageSelect /></Nav>
						<Nav>
							{this.state.examComponentSelected && (
								<div className="navbar-nav ml-auto">
									<div style={{width: "10px"}}></div>
									<Button onClick={this.examRef.current.toggleHelpSection} variant="secondary" size="sm" style={{paddingLeft: "10px"}}>{t("help")}</Button>
								</div>								
							)}							
						</Nav>																		
					</Navbar>	
					<Navbar bg="white" variant="light">
						<Nav  style={{backgroundColor: "white", width: "100%"}}>				
						{this.state.peopleComponentSelected && (
							<div>
								<Button href="#" variant="info">{t("new_person")}</Button>{' '}
								<Button href="#" variant="danger">{t("remove_person")}</Button>
							</div>							
						)}
						{this.state.examsComponentSelected && (
							<div>								
								<Link to="/add_exam_component" className="btn btn-info">{t("new_exam")}</Link>{' '}
								<Button variant="danger" onClick={() => { this.examsRef.current.handleDeleteExam() }}>{t("remove_exam")}</Button>
							</div>							
						)}
						{this.state.examComponentSelected && (
							<div>								
								<Button onClick={() => { this.examRef.current.handleAddRegistration() }} variant="info">{t("add_participant")}</Button>{' '}
								<Button onClick={() => { this.examRef.current.handleDeleteRegistration() }} variant="danger">{t("remove_participant")}</Button>								
							</div>							
						)}
						{this.state.addExamComponentSelected && (
							<div>
								<Button href="/add_exam_component" variant="secondary">{t("clear_form")}</Button>							
							</div>							
						)}
						{this.state.campsComponentSelected && (
							<div>								
								<Link to="/add_camp_component" className="btn btn-info">{t("new_camp")}</Link>{' '}
								<Button variant="danger" onClick={() => { this.campsRef.current.handleDeleteCamp() }}>{t("remove_camp")}</Button>
							</div>							
						)}
						{this.state.campComponentSelected && (
							<div>								
								<Button onClick={() => { this.campRef.current.handleAddRegistration() }} variant="info">{t("add_participant")}</Button>{' '}
								<Button onClick={() => { this.campRef.current.handleDeleteRegistration() }} variant="danger">{t("remove_participant")}</Button>
							</div>							
						)}
						{this.state.addCampComponentSelected && (
							<div>
								<Button href="/add_camp_component" variant="secondary">{t("clear_form")}</Button>
							</div>	
						)}
						{this.state.tournamentsComponentSelected && (
							<div>								
								<Link to="/add_tournament_component" className="btn btn-info">{t("new_tournament")}</Link>{' '}
								<Button variant="danger" onClick={() => { this.tournamentsRef.current.handleDeleteTournament() }}>{t("remove_tournament")}</Button>
							</div>							
						)}
						{this.state.tournamentComponentSelected && (
							<div>
								<Button onClick={() => { this.tournamentRef.current.handleAddTeam() }} variant="info">{t("add_team")}</Button>{' '}
								<Button onClick={() => { this.tournamentRef.current.handleDeleteRegistration() }} variant="danger">{t("remove_participant")}</Button>{' '}
								<Button onClick={() => { this.tournamentRef.current.handleDeleteTeam() }} variant="danger">{t("remove_team")}</Button>
							</div>							
						)}
						{this.state.addTournamentComponentSelected && (
							<div>
								<Button href="/add_tournament_component" variant="secondary">{t("clear_form")}</Button>
							</div>	
						)}
						{this.state.teamsComponentSelected && (
							<div>
								<Button onClick={() => { this.teamsRef.current.handleDeleteTeam() }} variant="danger">{t("remove_team")}</Button>
							</div>
						)}
						{this.state.teamComponentSelected && (
							<div>
								<Button onClick={() => { this.teamRef.current.handleShowAddParticipantToTeamModal(false) }} variant="info">{t("sign_up_participant")}</Button>{' '}
								<Button onClick={() => { this.teamRef.current.handleShowAddParticipantToTeamModal(true) }} variant="info">{t("sign_up_me")}</Button>{' '}
								<Button onClick={() => { this.teamRef.current.handleDeleteRegistration() }} variant="danger">{t("remove_participant")}</Button>
								
								{/* <Link onClick={() => { this.teamRef.current.handleShowAddParticipantToTeamModal(false) }} >
									<PersonPlusFill color="#008495" size={30} style={{marginLeft: "10px"}} />
								</Link>
								<Link onClick={() => { this.teamRef.current.handleShowAddParticipantToTeamModal(true) }} >
									<PersonCheckFill color="#008495" size={30} style={{marginLeft: "15px"}} />
								</Link>
								<Link onClick={() => { this.teamRef.current.handleDeleteRegistration() }} >
									<PersonDashFill color="#CB2334" size={30} style={{marginLeft: "15px"}} />
								</Link> */}
							</div>
						)}
						{this.state.clubDocumentsComponentSelected && (
							<div>								
								<Link to="/add_club_document_component" className="btn btn-info">{t("new_document")}</Link>{' '}
								<Button variant="danger" onClick={() => { this.clubDocumentsRef.current.handleDeleteClubDocument() }}>{t("remove_document")}</Button>
							</div>							
						)}
						{this.state.clubDocumentComponentSelected && (
							<div>	
							</div>							
						)}
						{this.state.addClubDocumentComponentSelected && (
							<div>
								<Button href="/add_club_document_component" variant="secondary">{t("clear_form")}</Button>
							</div>	
						)}
						{this.state.profileComponentSelected && (
							<div>
								<Button href="#" variant="danger">{t("remove_my_account")}</Button>
							</div>
						)}
						{this.state.eventWallComponentSelected && (
							<Form >
								<Form.Row>
									<Col><Form.Control type="text" placeholder="Search"  /></Col>
									<Col><Button type="submit" variant="info">{t("search")}</Button></Col>									
								</Form.Row>								
							</Form>							
						)}
						{this.state.downloadsComponentSelected && (
							<div>								
							</div>
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
							{/* <Route path="/login/:email" component={LoginComponent} /> */}
							<Route path="/login/:email" component={Login} />
							{/* <Route path="/signup" component={SignUpComponent} /> */}
							<Route path="/signup" component={SignUp} />

							{/* It was necessary to make conditions below nested. Place them on the same level doesn't work - when all three state variables 
							(showUsersTools, showTrainersTools and showAdministrativeTools) were set to "true", then it's expected that all routes below will be
							rendered, but only first group of routes was rendered, regardless of that which group was placed as first. Always only the first group 
							was rendered. */}

							{this.state.showUsersTools && (
								<div>
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
									<Route path="/downloads_component" render={(props) => (<Downloads {...props} navbarControlsHandler={() =>{
										if ( !this.state.downloadsComponentSelected ) {
											this.deselectAllComponents();
											this.setState({ downloadsComponentSelected: true });
										}
									}} />)} />
									{this.state.showTrainersTools && (
										<div>
											<Route path="/user/:userId/teams_component" 
											render={(props) => (<Teams {...props} ref={this.teamsRef} navbarControlsHandler={() => {
												if ( !this.state.teamsComponentSelected )
												{
													this.deselectAllComponents();
													this.setState({ teamsComponentSelected: true });
												}
											}} />)} />
											<Route path="/user/:userId/team_component/:teamId" 
											render={(props) => (<Team {...props} ref={this.teamRef} navbarControlsHandler={() => {
												if ( !this.state.teamComponentSelected )
												{
													this.deselectAllComponents();
													this.setState({ teamComponentSelected: true });
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

													<Route path="/club_documents_component" render={(props) => (<ClubDocuments {...props} ref={this.clubDocumentsRef} navbarControlsHandler={() => {
														if ( !this.state.clubDocumentsComponentSelected )
														{
															this.deselectAllComponents();
															this.setState({ clubDocumentsComponentSelected: true });
														}
													}} />)} />
													<Route path="/club_document_component/:id" render={(props) => (<ClubDocument {...props} ref={this.clubDocumentRef} navbarControlsHandler={() => {
														if ( !this.state.clubDocumentComponentSelected )
														{
															this.deselectAllComponents();
															this.setState({ clubDocumentComponentSelected: true });											
														}
													}} />)} />
													<Route path="/add_club_document_component" render={(props) => (<AddClubDocument {...props} navbarControlsHandler={() => {
														if ( !this.state.addClubDocumentComponentSelected )
														{
															this.deselectAllComponents();
															this.setState({ addClubDocumentComponentSelected: true });
														}
													}} />)} />
												</div>
											)}									
										</div>									
									)}	
								</div>
							)}																		
						</Switch>
					</div>
					{/* <div className="custom-bottom"></div> */}
				</div>
			</div>			
		);
	}
}

export default withTranslation()(App);
//export default withRouter(App);
//export default App;
