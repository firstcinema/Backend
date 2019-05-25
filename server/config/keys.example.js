module.exports = {
    expressPort: 5000,
    session: {
        cookieKey: ''
    },
    mongodb: {
        dbURI: '',
        secret: ''
    },
    emails: {
        auth: {
            api_key: 'SENDGRID_API_KEY'
        }
    },
    twitter: {
        consumerKey: '',
        consumerSecret: '',
        callback: '/api/auth/twitter/callback'
    },
    google: {
        clientId: '',
        clientSecret: '',
        callback: '/api/auth/google/callback'
    },
    facebook: {
        consumerKey: '',
        consumerSecret: '',
        callback: '/api/auth/facebook/callback'
    },
    discord: {
        clientId: '',
        clientSecret: '',
        callback: '/api/auth/discord/callback'
    },
}