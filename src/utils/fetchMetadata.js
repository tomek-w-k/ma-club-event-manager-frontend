export function fetchMetadataForGet(currentUser)
{
    return currentUser ? {
        method: "GET",
        headers: { "Authorization": "Bearer " + currentUser.accessToken }
    } : {
        method: "GET"        
    }
}

export function fetchMetadataForPost(currentUser, body)
{
    return currentUser ? {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + currentUser.accessToken
        },
        body: JSON.stringify(body)  
    } : {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"            
        },
        body: JSON.stringify(body)         
    }
}

export function fetchMetadataForDelete(currentUser) 
{
    return currentUser ? {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + currentUser.accessToken
        }
    } : {
        method: "DELETE"        
    }
}