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


const DISABLED_IN_DEMO_MODE = " (Disabled in demo mode)";
const DISABLED_TOOLBARL_ICON_COLOR = "gray";

export const peopleBottomToolbarIconDefs = (newPerson, removePerson, peopleRef) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{newPerson + DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link to="/add_person_component" >									 */}
                    <AiOutlineUserAdd color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "10px"}} />
                {/* </Link> */}
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removePerson + DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => { peopleRef.current.askForProfileRemoving() }} >									 */}
                    <AiOutlineUserDelete color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "15px"}} />
                {/* </Link> */}
            </OverlayTrigger>
        </div>
    );
};

export const examsBottomToolbarIconDefs = (newExam, removeExam, examsRef) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{newExam + DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link to="/add_exam_component" >									 */}
                    <HiOutlineViewGridAdd color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "10px"}} />
                {/* </Link> */}
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeExam + DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => { examsRef.current.handleDeleteExam() }} >									 */}
                    <IoTrashBinOutline color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "10px"}} />
                {/* </Link> */}
            </OverlayTrigger>
        </div>
    );
};

export const examBottomToolbarIconDefs = (addParticipant, removeParticipant, examRef) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{addParticipant+ DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => { examRef.current.handleAddRegistration() }} >									 */}
                    <AiOutlineUserAdd color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "10px"}} />
                {/* </Link> */}
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeParticipant+ DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => { examRef.current.handleDeleteRegistration() }} >									 */}
                    <AiOutlineUserDelete color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "15px"}} />
                {/* </Link> */}
            </OverlayTrigger>
        </div>
    );
};

export const campsBottomToolbarIconDefs = (newCamp, removeCamp, campsRef) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{newCamp+ DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link to="/add_camp_component" >									 */}
                    <HiOutlineViewGridAdd color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "10px"}} />
                {/* </Link> */}
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeCamp+ DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => { campsRef.current.handleDeleteCamp() }} >									 */}
                    <IoTrashBinOutline color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "10px"}} />
                {/* </Link> */}
            </OverlayTrigger>
        </div>	
    );
};

export const campBottomToolbarIconDefs = (addParticipant, removeParticipant, campRef) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{addParticipant+ DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => { campRef.current.handleAddRegistration() }} >									 */}
                    <AiOutlineUserAdd color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "10px"}} />
                {/* </Link> */}
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeParticipant+ DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => { campRef.current.handleDeleteRegistration() }} >									 */}
                    <AiOutlineUserDelete color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "15px"}} />
                {/* </Link> */}
            </OverlayTrigger>
        </div> 
    );
};

export const tournamentsBottomToolbarIconDefs = (newTournament, removeTournament, tournamentsRef) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{newTournament+ DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link to="/add_tournament_component" >									 */}
                    <HiOutlineViewGridAdd color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "10px"}} />
                {/* </Link> */}
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeTournament+ DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => { tournamentsRef.current.handleDeleteTournament() }} >									 */}
                    <IoTrashBinOutline color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "10px"}} />
                {/* </Link> */}
            </OverlayTrigger>
        </div>
    );
};

export const tournamentBottomToolbarIconDefs = (addTeam, removeTeam, removeParticipant, tournamentRef) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{addTeam+ DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => { tournamentRef.current.handleAddTeam() }} >									 */}
                    <AiOutlineUsergroupAdd color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "10px"}} />
                {/* </Link> */}
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeTeam+ DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => { tournamentRef.current.handleDeleteTeam() }} >									 */}
                    <AiOutlineUsergroupDelete color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "10px"}} />
                {/* </Link> */}
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeParticipant+ DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => {  tournamentRef.current.handleDeleteRegistration() }} >									 */}
                    <AiOutlineUserDelete color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "10px"}} />
                {/* </Link> */}
            </OverlayTrigger>
        </div>
    );
};

export const teamsBottomToolbarIconDefs = (removeTeam, teamsRef) => {
    return (
        <div>            
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeTeam + DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => { teamsRef.current.handleDeleteTeam() }} >									 */}
                    <AiOutlineUsergroupDelete color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "10px"}} />
                {/* </Link> */}
            </OverlayTrigger>
        </div>
    );
};

export const teamBottomToolbarIconDefs = (signUpParticipant, signUpMe, removeParticipant, teamRef) => {
    return (
        <div>            
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{signUpParticipant + DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => { teamRef.current.handleShowAddParticipantToTeamModal(false) }} >									 */}
                    <AiOutlineUserAdd color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "10px"}} />
                {/* </Link> */}
            </OverlayTrigger>								
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{signUpMe + DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => { teamRef.current.handleShowAddParticipantToTeamModal(true) }} >									 */}
                    <RiUserFollowLine color={DISABLED_TOOLBARL_ICON_COLOR} size={27} style={{marginLeft: "15px"}} />
                {/* </Link> */}
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeParticipant + DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => { teamRef.current.handleDeleteRegistration() }} >									 */}
                    <AiOutlineUserDelete color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "15px"}} />
                {/* </Link> */}
            </OverlayTrigger>								
        </div>
    );
};

export const clubDocumentsToolbarIconDefs = (newDocument, removeDocument, clubDocumentsRef) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{newDocument + DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link to="/add_club_document_component" >									 */}
                    <AiOutlineFileAdd color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "10px"}} />
                {/* </Link> */}
            </OverlayTrigger>								
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeDocument + DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => { clubDocumentsRef.current.handleDeleteClubDocument() }} >									 */}
                    <IoTrashBinOutline color={DISABLED_TOOLBARL_ICON_COLOR} size={27} style={{marginLeft: "15px"}} />
                {/* </Link> */}
            </OverlayTrigger>
        </div>		
    );
};

export const profileToolbarIconDefs = (removeMyAccount, profileRef) => {
    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeMyAccount + DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => { profileRef.current.askForProfileRemoving() }} >									 */}
                    <IoTrashBinOutline color={DISABLED_TOOLBARL_ICON_COLOR} size={27} style={{marginLeft: "15px"}} />
                {/* </Link> */}
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
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{addAdmin + DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => { settingsRef.current.handleManageAdminPrivileges(true) }} >									 */}
                    <AiOutlineUserAdd color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "10px"}} />
                {/* </Link> */}
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{removeAdmin + DISABLED_IN_DEMO_MODE}</Tooltip>} >
                {/* <Link onClick={() => { settingsRef.current.handleManageAdminPrivileges(false) }} >									 */}
                    <AiOutlineUserDelete color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "15px"}} />
                {/* </Link> */}
            </OverlayTrigger>
        </div>
    );

    let selectableUserOptionIcons = (
        <div>
            <OverlayTrigger placement="bottom" overlay={renderOptionNameTooltip(localStorage.getItem("settingsSelectedTab"), 
                                                                                addBranchChief + DISABLED_IN_DEMO_MODE, 
                                                                                addClub + DISABLED_IN_DEMO_MODE, 
                                                                                addRank + DISABLED_IN_DEMO_MODE)
            }>
                {/* <Link to="/add_selectable_user_option_component" >									 */}
                    <HiOutlineViewGridAdd color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "10px"}} />
                {/* </Link> */}
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={renderRemoveOptionNameTooltip(  localStorage.getItem("settingsSelectedTab"), 
                                                                                        removeBranchChief + DISABLED_IN_DEMO_MODE, 
                                                                                        removeClub + DISABLED_IN_DEMO_MODE, 
                                                                                        removeRank + DISABLED_IN_DEMO_MODE)
            }>
                {/* <Link onClick={() => { settingsRef.current.confirmDeleteSelectableUserOption() }} >									 */}
                    <IoTrashBinOutline color={DISABLED_TOOLBARL_ICON_COLOR} size={30} style={{marginLeft: "10px"}} />
                {/* </Link> */}
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

