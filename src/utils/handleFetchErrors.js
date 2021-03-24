export function handleFetchErrors(response)
{    
    if ( !response.ok )
        throw Error(response.statusText);
    
    return response;
}

export function handleMultipleFetchErrors(responses)
{
    if ( responses.some(response => !response.ok) )
        throw Error;

    return responses;
}