interface FetchAuthTokenOptions {
    option: 'none' | 'local' | 'api'
};

const fetchAuthToken = async (options: FetchAuthTokenOptions) => {
    if (options.option === 'none') {
        return '';
    }

    if (options.option === 'local') {
        return import.meta.env.VITE_AUTH_TOKEN || '';
    }

    if (options.option === 'api') {
        // const authToken = await fetchAuthTokenViaApi();
        const authToken = '';
        return authToken;
    }
};

export default fetchAuthToken;