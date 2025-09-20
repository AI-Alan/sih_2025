const config = {
    API_BASE_URL: 'http://localhost:8080',
    TIMEOUT: 5000,
    RETRY_ATTEMPTS: 3,


    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',

    },

    API_VERSION: 'v1',
    RETRY_DELAY: 1000,


}


export default config;