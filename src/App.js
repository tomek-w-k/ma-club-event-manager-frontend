import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
	Navbar,
	Nav,	
	Button,	
	Image
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { MDBIcon } from "mdbreact";

import Login from "./component/security/Login";
import SignUp from "./component/security/SignUp";
import PasswordReset from "./component/security/PasswordReset";

import People from "./component/admin/people/People";
import Person from "./component/admin/people/Person";
import AddPerson from "./component/admin/people/AddPerson";

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

import Settings from "./component/admin/settings/Settings";
import AddSelectableUserOption from "./component/admin/settings/AddSelectableUserOption";
import * as SettingsConstants from "./component/admin/settings/settingsConstants";
import { getGeneralSettings } from "./component/admin/settings/getGeneralSettings";

import { 	
	peopleBottomToolbarIconDefs,	
	examsBottomToolbarIconDefs,
	examBottomToolbarIconDefs,	
	campsBottomToolbarIconDefs,
	campBottomToolbarIconDefs,	
	tournamentsBottomToolbarIconDefs,
	tournamentBottomToolbarIconDefs,	
	teamsBottomToolbarIconDefs,
	teamBottomToolbarIconDefs,
	clubDocumentsToolbarIconDefs,	
	profileToolbarIconDefs,
	eventWallToolbarIconDefs,
	clearForm,
	showToolbarIconsForSettingsTab,
} from "./utils/bottomToolbarIconDefs";


const user = AuthService.getCurrentUser();


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
			settingsSelectedTab: "",
			clubLogoPath: "",
			clubName: "",            
            facebookUrl: "",
            youtubeUrl: "",
            instagramUrl: "",
		};
		this.logout = this.logout.bind(this);
		this.deselectAllComponents = this.deselectAllComponents.bind(this);

		this.peopleRef = React.createRef();
		this.personRef = React.createRef();
		this.addPersonRef = React.createRef();
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
		this.profileRef = React.createRef();
		this.settingsRef = React.createRef();
		this.addSelectableUserOptionRef = React.createRef();
	}

	componentDidMount()
	{
		const t = this.props.t;
		
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

		getGeneralSettings(user)
		.then(data => { 
			this.setState({
				clubLogoPath: data[SettingsConstants.PropertyNames.CLUB_LOGO_PATH] ? data[SettingsConstants.PropertyNames.CLUB_LOGO_PATH].value : "",
				clubName: data[SettingsConstants.PropertyNames.CLUB_NAME] ? data[SettingsConstants.PropertyNames.CLUB_NAME].value : "",					
				facebookUrl: data[SettingsConstants.PropertyNames.FACEBOOK_URL] ? data[SettingsConstants.PropertyNames.FACEBOOK_URL].value : "",
				youtubeUrl: data[SettingsConstants.PropertyNames.YOUTUBE_URL] ? data[SettingsConstants.PropertyNames.YOUTUBE_URL].value : "",
				instagramUrl: data[SettingsConstants.PropertyNames.INSTAGRAM_URL] ? data[SettingsConstants.PropertyNames.INSTAGRAM_URL].value : ""
			}, 
			() => { document.title = this.state.clubName ? this.state.clubName : "ClubEventManager" });
		})
		.catch(error => this.setState({ errorMessage: t("failed_to_fetch") }));
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
			personComponentSelected: false,
			addPersonComponentSelected: false,

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

			settingsComponentSelected: false,
			addSelectableUserOptionComponentSelected: false,
		});
	}

	render()
	{
		let USER_TEAMS_ROUTE = user ? "/user/" + user.id + "/teams_component" : "";
		const t = this.props.t;

		return(			
			<div>
				<div className="sidenav">
					<div className="club-logo">						
						<Image 	src={this.state.clubLogoPath}
								style={{width: "100%", height: "100%", objectFit: "contain", padding: "4px"}}
						/>						
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
								<Link to="/settings_component" className="nav-link sidenav-text" style={{color:"black"}} >{t("settings")}</Link>
							</div>							
						)}
						{this.state.showTrainersTools && (
							<div>
								<div style={{fontSize: "small", paddingLeft:"10px", paddingTop:"20px"}}>{t("trainers_tools")}</div>
								<Link to={USER_TEAMS_ROUTE} className="nav-link sidenav-text" style={{color:"black"}} >{t("teams")}</Link>								
							</div>
						)}	
						{(this.state.showAdministrativeTools || this.state.showTrainersTools) && (							
							<div style={{fontSize: "small", paddingLeft:"10px", paddingTop:"20px"}}>{t("users_tools")}</div>							
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
							{this.state.personComponentSelected && (<div>{t("person")}</div>)}							
							{this.state.addPersonComponentSelected && (<div>{t("add_person")}</div>)}							

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

							{this.state.settingsComponentSelected && (<div>{t("settings")}</div>)}
							{this.state.addSelectableUserOptionComponentSelected && 
								(localStorage.getItem("settingsSelectedTab") == SettingsConstants.BRANCH_CHIEFS_SELECTABLE_OPTION) && (<div>{t("add_branch_chief")}</div>)}
							{this.state.addSelectableUserOptionComponentSelected && 
								(localStorage.getItem("settingsSelectedTab") == SettingsConstants.CLUBS_SELECTABLE_OPTION) && (<div>{t("add_club")}</div>)}
							{this.state.addSelectableUserOptionComponentSelected && 
								(localStorage.getItem("settingsSelectedTab") == SettingsConstants.RANKS_SELECTABLE_OPTION) && (<div>{t("add_rank")}</div>)}							
						</Navbar.Brand>
						<Nav className="mr-auto" ></Nav>
						<Nav>
							{this.state.currentUser ? ( 
								<div className="navbar-nav ml-auto" style={{display: "flex", alignItems: "center"}}>
									<li className="nav-item"><Link to="/profile_component" className="btn btn-outline-secondary btn-sm">{this.state.currentUser.email}</Link></li>
									<div style={{width: "10px"}}></div>
									<li className="nav-item"><Link to={"/login/@"} className="btn btn-secondary btn-sm" onClick={this.logout}>{t("logout")}</Link></li>
								</div>															
								) : ( 
								<div className="navbar-nav ml-auto">
									<li className="nav-item"><Link to={"/login/@"} className="btn btn-secondary btn-sm" >{t("login")}</Link></li>
									<div style={{width: "10px"}}></div>
									<li className="nav-item"><Link to={"/signup"} className="btn btn-secondary btn-sm disabled">{t("sign_up")}</Link></li>
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
						{this.state.peopleComponentSelected && (peopleBottomToolbarIconDefs(t("new_person"), t("remove_person"), this.peopleRef))}
						{this.state.personComponentSelected && (<div></div>)}
						{this.state.addPersonComponentSelected && (clearForm(t("clear_form")))}
						{this.state.examsComponentSelected && (examsBottomToolbarIconDefs(t("new_exam"), t("remove_exam"), this.examsRef))}
						{this.state.examComponentSelected && (examBottomToolbarIconDefs(t("add_participant"), t("remove_participant"), this.examRef))}
						{this.state.addExamComponentSelected && (clearForm(t("clear_form")))}
						{this.state.campsComponentSelected && (campsBottomToolbarIconDefs(t("new_camp"), t("remove_camp"), this.campsRef))}
						{this.state.campComponentSelected && (campBottomToolbarIconDefs(t("add_participant"), t("remove_participant"), this.campRef))}
						{this.state.addCampComponentSelected && (clearForm(t("clear_form")))}
						{this.state.tournamentsComponentSelected && (tournamentsBottomToolbarIconDefs(t("new_tournament"), t("remove_tournament"), this.tournamentsRef))}
						{this.state.tournamentComponentSelected && (tournamentBottomToolbarIconDefs(t("add_team"), t("remove_team"), t("remove_participant"), this.tournamentRef))}
						{this.state.addTournamentComponentSelected && (clearForm(t("clear_form")))}
						{this.state.teamsComponentSelected && (teamsBottomToolbarIconDefs(t("remove_team"), this.teamsRef))}
						{this.state.teamComponentSelected && (teamBottomToolbarIconDefs(t("sign_up_participant"), t("sign_up_me"), t("remove_participant"), this.teamRef))}
						{this.state.clubDocumentsComponentSelected && (clubDocumentsToolbarIconDefs(t("new_document"), t("remove_document"), this.clubDocumentsRef))}
						{this.state.clubDocumentComponentSelected && (<div></div>)}
						{this.state.addClubDocumentComponentSelected && (clearForm(t("clear_form")))}
						{this.state.settingsComponentSelected && showToolbarIconsForSettingsTab(
							localStorage.getItem("settingsSelectedTab"), 
							t("restore_saved_settings"), t("add_admin"), t("remove_admin"), this.settingsRef,
							t("add_branch_chief"), t("add_club"), t("add_rank"),
							t("remove_branch_chief"), t("remove_club"), t("remove_rank") 
						)}
						{this.state.addSelectableUserOptionComponentSelected && (clearForm(t("clear_form")))}						
						{this.state.profileComponentSelected && (profileToolbarIconDefs(t("remove_my_account"), this.profileRef))}
						{this.state.eventWallComponentSelected && (eventWallToolbarIconDefs(t("search")))}
						{this.state.downloadsComponentSelected && (<div></div>)}
						</Nav>
						<Nav className="ml-auto">
							<a href={this.state.facebookUrl} target="_blank" className="nav-link"><MDBIcon fab icon="facebook-f" /></a>
							<a href={this.state.youtubeUrl} target="_blank" className="nav-link"><MDBIcon fab icon="youtube" /></a>
							<a href={this.state.instagramUrl} target="_blank" className="nav-link"><MDBIcon fab icon="instagram" /></a>
						</Nav>
					</Navbar>					
					</div>
					<div className="content">
						<Switch>
							<Route path="/login/:email" component={Login} />							
							{/* <Route path="/signup" component={SignUp} /> */}
							<Route path="/password_reset/:token" render={(props) => (<PasswordReset {...props} /> )} />

							{/* It was necessary to make conditions below nested. Place them on the same level doesn't work - when all three state variables 
							(showUsersTools, showTrainersTools and showAdministrativeTools) were set to "true", then it's expected that all routes below will be
							rendered, but only first group of routes was rendered, regardless of that which group was placed as first. Always only the first group 
							was rendered. */}

							{this.state.showUsersTools && (
								<div>
									<Route path="/profile_component" render={(props) => (<Profile {...props} ref={this.profileRef} navbarControlsHandler={() => {
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
													<Route path="/people_component" render={(props) => (<People {...props} ref={this.peopleRef} navbarControlsHandler={() => {
														if ( !this.state.peopleComponentSelected )
														{
															this.deselectAllComponents();
															this.setState({ peopleComponentSelected: true });
														}
													}} />)} />
													<Route path="/person_component/:id" render={(props) => (<Person {...props} ref={this.personRef} navbarControlsHandler={() => {
														if ( !this.state.personComponentSelected ) {
															this.deselectAllComponents();
															this.setState({ personComponentSelected:  true });
														}
													}} /> )} />
													{/* <Route path="/add_person_component/" render={(props) => (<AddPerson {...props} ref={this.addPersonRef} navbarControlsHandler={() => {
														if ( !this.state.addPersonComponentSelected ) {
															this.deselectAllComponents();
															this.setState({ addPersonComponentSelected:  true });
														}
													}} /> )} /> */}
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
													{/* <Route path="/add_exam_component" render={(props) => (<AddExam {...props} navbarControlsHandler={() => {
														if ( !this.state.addExamComponentSelected )
														{
															this.deselectAllComponents();
															this.setState({ addExamComponentSelected: true });
														}
													}} />)} /> */}
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
													{/* <Route path="/add_camp_component" render={(props) => (<AddCamp {...props} navbarControlsHandler={() => {
														if ( !this.state.addCampComponentSelected )
														{
															this.deselectAllComponents();
															this.setState({ addCampComponentSelected: true });
														}
													}} />)} /> */}
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
													{/* <Route path="/add_tournament_component" render={(props) => (<AddTournament {...props} navbarControlsHandler={() => {
														if ( !this.state.addTournamentComponentSelected )
														{
															this.deselectAllComponents();
															this.setState({ addTournamentComponentSelected: true });
														}
													}} />)} /> */}

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
													{/* <Route path="/add_club_document_component" render={(props) => (<AddClubDocument {...props} navbarControlsHandler={() => {
														if ( !this.state.addClubDocumentComponentSelected )
														{
															this.deselectAllComponents();
															this.setState({ addClubDocumentComponentSelected: true });
														}
													}} />)} /> */}
													<Route path="/settings_component" render={(props) => (<Settings {...props} ref={this.settingsRef} 
														navbarControlsHandler={() => {
															if ( !this.state.settingsComponentSelected )
															{
																this.deselectAllComponents();
																this.setState({ settingsComponentSelected: true });																
															}
														}}
														setSelectedTab={(tabIndex) => {
															this.setState({ settingsSelectedTab: tabIndex });
															localStorage.setItem("settingsSelectedTab", tabIndex);
														}}
													 />)} />
													{/* <Route path="/add_selectable_user_option_component" render={(props) => (<AddSelectableUserOption {...props} ref={this.addSelectableUserOptionRef}
														navbarControlsHandler={() => {
															if ( !this.state.addSelectableUserOptionComponentSelected )
															{
																this.deselectAllComponents();
																this.setState({ addSelectableUserOptionComponentSelected: true });															
															}
														}}														
													/>)} /> */}
												</div>
											)}									
										</div>									
									)}	
								</div>
							)}	
							{user == null ? <Route path="/" component={Login} /> : <div></div>}						
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
