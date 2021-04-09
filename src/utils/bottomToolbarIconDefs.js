import {BrowserRouter as Router, Switch, Route, Link, withRouter } from "react-router-dom";
import {
	Navbar,
	Nav,
	Form,
	Col,
	Button,
	OverlayTrigger,
	Tooltip,
    Image,    
} from "react-bootstrap";
import {AiOutlineUsergroupAdd} from "react-icons/ai";
import {AiOutlineUsergroupDelete} from "react-icons/ai";
import {AiOutlineUserAdd} from "react-icons/ai";
import {AiOutlineUserDelete} from "react-icons/ai";
import {AiOutlineClear} from "react-icons/ai";
import {AiOutlineFileAdd} from "react-icons/ai";
import {AiOutlineSearch} from "react-icons/ai";
import {RiUserFollowLine} from "react-icons/ri";
import {HiOutlineViewGridAdd} from "react-icons/hi";
import {IoTrashBinOutline} from "react-icons/io5";
import * as SettingsConstants from "../component/admin/settings/settingsConstants";

export const peopleBottomToolbarIconDefs = (newPerson, removePerson, peopleRef) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{newPerson}</Tooltip>} >
                <Link to="/add_person_component" >									
                    <AiOutlineUserAdd color="#008495" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removePerson}</Tooltip>} >
                <Link onClick={() => { peopleRef.current.askForProfileRemoving() }} >									
                    <AiOutlineUserDelete color="#CB2334" size={30} style={{marginLeft: "15px"}} />
                </Link>
            </OverlayTrigger>
        </div>
    );
};

export const examsBottomToolbarIconDefs = (newExam, removeExam, examsRef) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{newExam}</Tooltip>} >
                <Link to="/add_exam_component" >									
                    <HiOutlineViewGridAdd color="#008495" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeExam}</Tooltip>} >
                <Link onClick={() => { examsRef.current.handleDeleteExam() }} >									
                    <IoTrashBinOutline color="#CB2334" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>
        </div>
    );
};

export const examBottomToolbarIconDefs = (addParticipant, removeParticipant, examRef) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{addParticipant}</Tooltip>} >
                <Link onClick={() => { examRef.current.handleAddRegistration() }} >									
                    <AiOutlineUserAdd color="#008495" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeParticipant}</Tooltip>} >
                <Link onClick={() => { examRef.current.handleDeleteRegistration() }} >									
                    <AiOutlineUserDelete color="#CB2334" size={30} style={{marginLeft: "15px"}} />
                </Link>
            </OverlayTrigger>
        </div>
    );
};

export const campsBottomToolbarIconDefs = (newCamp, removeCamp, campsRef) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{newCamp}</Tooltip>} >
                <Link to="/add_camp_component" >									
                    <HiOutlineViewGridAdd color="#008495" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeCamp}</Tooltip>} >
                <Link onClick={() => { campsRef.current.handleDeleteCamp() }} >									
                    <IoTrashBinOutline color="#CB2334" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>
        </div>	
    );
};

export const campBottomToolbarIconDefs = (addParticipant, removeParticipant, campRef) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{addParticipant}</Tooltip>} >
                <Link onClick={() => { campRef.current.handleAddRegistration() }} >									
                    <AiOutlineUserAdd color="#008495" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeParticipant}</Tooltip>} >
                <Link onClick={() => { campRef.current.handleDeleteRegistration() }} >									
                    <AiOutlineUserDelete color="#CB2334" size={30} style={{marginLeft: "15px"}} />
                </Link>
            </OverlayTrigger>
        </div> 
    );
};

export const tournamentsBottomToolbarIconDefs = (newTournament, removeTournament, tournamentsRef) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{newTournament}</Tooltip>} >
                <Link to="/add_tournament_component" >									
                    <HiOutlineViewGridAdd color="#008495" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeTournament}</Tooltip>} >
                <Link onClick={() => { tournamentsRef.current.handleDeleteTournament() }} >									
                    <IoTrashBinOutline color="#CB2334" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>
        </div>
    );
};

export const tournamentBottomToolbarIconDefs = (addTeam, removeTeam, removeParticipant, tournamentRef) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{addTeam}</Tooltip>} >
                <Link onClick={() => { tournamentRef.current.handleAddTeam() }} >									
                    <AiOutlineUsergroupAdd color="#008495" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeTeam}</Tooltip>} >
                <Link onClick={() => { tournamentRef.current.handleDeleteTeam() }} >									
                    <AiOutlineUsergroupDelete color="#CB2334" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeParticipant}</Tooltip>} >
                <Link onClick={() => {  tournamentRef.current.handleDeleteRegistration() }} >									
                    <AiOutlineUserDelete color="#CB2334" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>
        </div>
    );
};

export const teamsBottomToolbarIconDefs = (removeTeam, teamsRef) => {
    return (
        <div>            
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeTeam}</Tooltip>} >
                <Link onClick={() => { teamsRef.current.handleDeleteTeam() }} >									
                    <AiOutlineUsergroupDelete color="#CB2334" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>
        </div>
    );
};

export const teamBottomToolbarIconDefs = (signUpParticipant, signUpMe, removeParticipant, teamRef) => {
    return (
        <div>            
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{signUpParticipant}</Tooltip>} >
                <Link onClick={() => { teamRef.current.handleShowAddParticipantToTeamModal(false) }} >									
                    <AiOutlineUserAdd color="#008495" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>								
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{signUpMe}</Tooltip>} >
                <Link onClick={() => { teamRef.current.handleShowAddParticipantToTeamModal(true) }} >									
                    <RiUserFollowLine color="#008495" size={27} style={{marginLeft: "15px"}} />
                </Link>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeParticipant}</Tooltip>} >
                <Link onClick={() => { teamRef.current.handleDeleteRegistration() }} >									
                    <AiOutlineUserDelete color="#CB2334" size={30} style={{marginLeft: "15px"}} />
                </Link>
            </OverlayTrigger>								
        </div>
    );
};

export const clubDocumentsToolbarIconDefs = (newDocument, removeDocument, clubDocumentsRef) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{newDocument}</Tooltip>} >
                <Link to="/add_club_document_component" >									
                    <AiOutlineFileAdd color="#008495" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>								
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeDocument}</Tooltip>} >
                <Link onClick={() => { clubDocumentsRef.current.handleDeleteClubDocument() }} >									
                    <IoTrashBinOutline color="#CB2334" size={27} style={{marginLeft: "15px"}} />
                </Link>
            </OverlayTrigger>
        </div>		
    );
};

export const profileToolbarIconDefs = (removeMyAccount, profileRef) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeMyAccount}</Tooltip>} >
                <Link onClick={() => { profileRef.current.askForProfileRemoving() }} >									
                    <IoTrashBinOutline color="#CB2334" size={27} style={{marginLeft: "15px"}} />
                </Link>
            </OverlayTrigger>
        </div>	
    );
};

export const eventWallToolbarIconDefs = (search) => {
    return (
        <Form >
            <Form.Row>
                <Col><Form.Control type="text" placeholder={search}  /></Col>
                {/* <Col><Button type="submit" variant="info">{t("search")}</Button></Col> */}
                <Col style={{padding: "5px 0"}}>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>{search}</Tooltip>} >
                        <Link onClick={() => window.location.reload()} >									
                            <AiOutlineSearch color="gray" size={30} style={{marginLeft: "10px"}} />
                        </Link>
                    </OverlayTrigger>
                </Col>																		
            </Form.Row>								
        </Form>	
    );
};

export const clearForm = (clearForm) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{clearForm}</Tooltip>} >
                <Link onClick={() => window.location.reload()} >									
                    <AiOutlineClear color="gray" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>
        </div>
    );
};

const renderOptionNameTooltip = (renderOption, addBranchChief, addClub, addRank) => {
    switch(renderOption)
    {
        case SettingsConstants.BRANCH_CHIEFS_SELECTABLE_OPTION: return <Tooltip>{addBranchChief}</Tooltip>;
        case SettingsConstants.CLUBS_SELECTABLE_OPTION: return <Tooltip>{addClub}</Tooltip>;
        case SettingsConstants.RANKS_SELECTABLE_OPTION: return <Tooltip>{addRank}</Tooltip>;
        default: return <div></div>;
    }
};
	
const renderRemoveOptionNameTooltip = (renderRemoveOption, removeBranchChief, removeClub, removeRank) => {
    switch(renderRemoveOption)
    {
        case SettingsConstants.BRANCH_CHIEFS_SELECTABLE_OPTION: return <Tooltip>{removeBranchChief}</Tooltip>;
        case SettingsConstants.CLUBS_SELECTABLE_OPTION: return <Tooltip>{removeClub}</Tooltip>;
        case SettingsConstants.RANKS_SELECTABLE_OPTION: return <Tooltip>{removeRank}</Tooltip>;
        default: return <div></div>;
    }
};

export const showToolbarIconsForSettingsTab = ( option, 
                                                restoreSavedSettings,
                                                addAdmin, 
                                                removeAdmin, 
                                                settingsRef,                                                
                                                addBranchChief,
                                                addClub,
                                                addRank,                                                
                                                removeBranchChief,
                                                removeClub, 
                                                removeRank ) => {    
    let generalSettingsIcons = (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{restoreSavedSettings}</Tooltip>} >
                <Link onClick={() => window.location.reload()} >									
                    <AiOutlineClear color="gray" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>
        </div>
    );

    let administratorsSettingsIcons = (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{addAdmin}</Tooltip>} >
                <Link onClick={() => { settingsRef.current.handleManageAdminPrivileges(true) }} >									
                    <AiOutlineUserAdd color="#008495" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeAdmin}</Tooltip>} >
                <Link onClick={() => { settingsRef.current.handleManageAdminPrivileges(false) }} >									
                    <AiOutlineUserDelete color="#CB2334" size={30} style={{marginLeft: "15px"}} />
                </Link>
            </OverlayTrigger>
        </div>
    );

    let selectableUserOptionIcons = (
        <div>
            <OverlayTrigger placement="bottom" overlay={renderOptionNameTooltip(localStorage.getItem("settingsSelectedTab"), 
                                                                                addBranchChief, 
                                                                                addClub, 
                                                                                addRank)
            }>
                <Link to="/add_selectable_user_option_component" >									
                    <HiOutlineViewGridAdd color="#008495" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={renderRemoveOptionNameTooltip(  localStorage.getItem("settingsSelectedTab"), 
                                                                                        removeBranchChief, 
                                                                                        removeClub, 
                                                                                        removeRank)
            }>
                <Link onClick={() => { settingsRef.current.confirmDeleteSelectableUserOption() }} >									
                    <IoTrashBinOutline color="#CB2334" size={30} style={{marginLeft: "10px"}} />
                </Link>
            </OverlayTrigger>								
        </div>
    );

    switch(option)
    {            
        case SettingsConstants.GENERAL_SETTINGS: return generalSettingsIcons;
        case SettingsConstants.ADMINISTRATORS_SETTINGS: return administratorsSettingsIcons;
        case SettingsConstants.BRANCH_CHIEFS_SELECTABLE_OPTION: return selectableUserOptionIcons;
        case SettingsConstants.CLUBS_SELECTABLE_OPTION: return selectableUserOptionIcons;
        case SettingsConstants.RANKS_SELECTABLE_OPTION: return selectableUserOptionIcons;
        default: return <div></div>;
    }
};

