import {GET_METHOD} from "./constants.js";

// UNIVERSAL API FETCH METHOD //
async function fetchAnyUrl(urlPath, method = GET_METHOD, options = {}) { // Default set to GET
    const jwt = localStorage.getItem('jwt');
    const { headers = {}, body = {}, ...otherOptions } = options;

    const fetchOptions = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
            ...(jwt ? { 'Authorization': `Bearer ${jwt}` } : {}),
        },
            body: method !== GET_METHOD ? body : undefined, // Include body only for non-GET methods
        ...otherOptions,
    };

    try {
        const response = await fetch(urlPath, fetchOptions);

        // Check for a successful response
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText} (${method} ${urlPath})`);
        }


        // Attempt to parse as JSON if not empty
        return response.json();
    } catch (error) {
        console.error(`Error in apiCall with ${method} ${urlPath}: `, error);
        throw error;
    }
}

export {fetchAnyUrl};