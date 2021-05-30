import * as Urls from "../../../servers-urls";


export const BRANCH_CHIEFS_SELECTABLE_OPTION = "branchChiefs";
export const CLUBS_SELECTABLE_OPTION = "clubs";
export const RANKS_SELECTABLE_OPTION = "ranks";
export const GENERAL_SETTINGS = "generalSettings";
export const ADMINISTRATORS_SETTINGS = "administratorsSettings"
export const BRANCH_CHIEFS_URL = Urls.WEBSERVICE_URL + "/branch_chiefs";
export const CLUBS_URL = Urls.WEBSERVICE_URL + "/clubs";
export const RANKS_URL = Urls.WEBSERVICE_URL + "/ranks";
export const ADMINISTRATOR_USERS_URL = Urls.WEBSERVICE_URL + "/roles/ROLE_ADMIN/users?hasRole=yes";
export const NON_ADMINISTRATOR_USERS_URL = Urls.WEBSERVICE_URL + "/roles/ROLE_ADMIN/users?hasRole=no";
export const USERS_URL = Urls.WEBSERVICE_URL + "/users/";
export const ROLES_URL = Urls.WEBSERVICE_URL + "/roles/";
export const ADMINISTRATORS = Urls.WEBSERVICE_URL + "/administrators";
export const PROPERTY_URL = Urls.WEBSERVICE_URL + "/property";
export const CLUB_LOGO_PATH_URL = Urls.WEBSERVICE_URL + "/club_logo_path";
export const CLUB_NAME_URL = Urls.WEBSERVICE_URL + "/club_name";
export const TERMS_AND_CONDITIONS_PL = Urls.WEBSERVICE_URL + "/terms_and_conditions_pl";
export const TERMS_AND_CONDITIONS_EN = Urls.WEBSERVICE_URL + "/terms_and_conditions_en";
export const PRIVACY_POLICY_PL = Urls.WEBSERVICE_URL + "/privacy_policy_pl";
export const PRIVACY_POLICY_EN = Urls.WEBSERVICE_URL + "/privacy_policy_en";
export const GDPR_CLAUSE_PL = Urls.WEBSERVICE_URL + "/gdpr_clause_pl";
export const GDPR_CLAUSE_EN = Urls.WEBSERVICE_URL + "/gdpr_clause_en";

export const PropertyNames = Object.freeze({
    CLUB_LOGO_PATH: 0,
    CLUB_NAME: 1,
    CONTACT_EMAIL: 2,
    FACEBOOK_URL: 3,
    YOUTUBE_URL: 4,
    INSTAGRAM_URL: 5
});

export const FormalRules = Object.freeze({
    TERMS_AND_CONDITIONS_PL: 0,
    TERMS_AND_CONDITIONS_EN: 1,
    PRIVACY_POLICY_PL: 2,
    PRIVACY_POLICY_EN: 3,
    GDPR_CLAUSE_PL: 4,
    GDPR_CLAUSE_EN: 5
});