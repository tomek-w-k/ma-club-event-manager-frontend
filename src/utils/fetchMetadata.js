export function fetchMetadataForGet(currentUser)
{
    return currentUser ? {
        method: "GET",
        headers: { "Authorization": "Bearer " + currentUser.accessToken }
    } : {
        method: "GET"        
    }
}