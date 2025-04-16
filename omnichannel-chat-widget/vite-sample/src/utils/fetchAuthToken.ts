interface FetchAuthTokenOptions {
    option: 'none' | 'local' | 'api'
};

const fetchAuthToken = async (options: FetchAuthTokenOptions) => {
    let authToken = '';
    if (options.option === 'none') {
        return '';
    }

    if (options.option === 'local') {
        authToken = import.meta.env.VITE_AUTH_TOKEN || '';
    }

    if (options.option === 'api') {
        // authToken = await fetchAuthTokenViaApi();
    }

    return authToken;
};

export default fetchAuthToken;