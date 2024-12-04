const BASE_URL = 'http://localhost:8080';

async function localApiCallWithFullUrl(urlPath, method = 'GET', options = {}) {
    const { baseUrl = BASE_URL, headers = {}, ...otherOptions } = options;
    // Always corrects input with "/" - no matter if input has "/" or not. TODO
    const url = `${baseUrl.replace(/\/+$/, '')}/${encodeURI(urlPath).replace(/^\/+/, '')}`;

    // Set fetch options with default JSON content type and merge headers
    const fetchOptions = {
        method,
        headers: { 'Content-Type': 'application/json', ...headers },
        ...otherOptions,
    };

    try {
        const response = await fetch(url, fetchOptions);

        // Check for a successful response
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText} (${method} ${url})`);
        }

        // Return the response as JSON
        return await response.json();
    } catch (error) {
        console.error(`Error in apiCall with ${method} ${url}: `, error);
        throw error;
    }
}

async function apiCallWithFullUrl(fullUrlPath, method = 'GET', options = {}) {
    const fetchOptions = {
        method,
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    };

    try {
        const response = await fetch(fullUrlPath, fetchOptions);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText} (${method} ${fullUrlPath})`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error in apiCall with ${method} ${fullUrlPath}: `, error);
        throw error;
    }
}

export { apiCallWithFullUrl, localApiCallWithFullUrl };