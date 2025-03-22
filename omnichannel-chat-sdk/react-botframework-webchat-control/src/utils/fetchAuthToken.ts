interface FetchAuthTokenOptions {
    option: 'none' | 'local' 
};

const fetchAuthToken = async (options: FetchAuthTokenOptions) => {
    if (options.option === 'none') {
        return '';
    }

    if (options.option === 'local') {
        return import.meta.env.VITE_AUTH_TOKEN || '';
    }
};

export default fetchAuthToken;