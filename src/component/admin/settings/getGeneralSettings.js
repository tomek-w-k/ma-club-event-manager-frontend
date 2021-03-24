import * as SettingsConstants from "./settingsConstants";
import { fetchMetadataForGet } from "../../../utils/fetchMetadata";
import { handleMultipleFetchErrors } from "../../../utils/handleFetchErrors";


export function getGeneralSettings(currentUser)
{
    let settingsRequests = [];
    settingsRequests.push( fetch(SettingsConstants.CLUB_LOGO_PATH_URL, fetchMetadataForGet(currentUser) ));
    settingsRequests.push( fetch(SettingsConstants.CLUB_NAME_URL, fetchMetadataForGet(currentUser) ));

    if (currentUser ) 
    {        
        settingsRequests.push( fetch(SettingsConstants.PROPERTY_URL + "/contact_email", fetchMetadataForGet(currentUser) ));
        settingsRequests.push( fetch(SettingsConstants.PROPERTY_URL + "/facebook_url", fetchMetadataForGet(currentUser) ));
        settingsRequests.push( fetch(SettingsConstants.PROPERTY_URL + "/youtube_url", fetchMetadataForGet(currentUser) ));
        settingsRequests.push( fetch(SettingsConstants.PROPERTY_URL + "/instagram_url", fetchMetadataForGet(currentUser) ));
    }

    return Promise.all(settingsRequests)        
    .then(handleMultipleFetchErrors)
    .then(responses => responses.map(response => response.json()))        
    .then(jsonResponses => Promise.all(jsonResponses).then(data => data) );
}