// ==============================================
//                    DEV
// ==============================================
const isDevEnv = true;

const loginURL = "https://taskify-secuirty.auth.eu-west-1.amazoncognito.com/oauth2/authorize?client_id=66lc4rli2hjagrads5atsjbumg&response_type=token&scope=email+openid+profile&redirect_uri=http://localhost:5500";

const LOGIN_PATH = 'http://localhost:5500/login.html';
const API_URL = 'http://localhost:5000/';




// ==============================================
//                    PROD-ish
// ==============================================
// const isDevEnv = false;

// const loginURL = "https://taskify-secuirty.auth.eu-west-1.amazoncognito.com/oauth2/authorize?client_id=66lc4rli2hjagrads5atsjbumg&response_type=token&scope=email+openid+profile&redirect_uri=https://taskify.phipson.co.za";


// const LOGIN_PATH = 'https://taskify.phipson.co.za/login.html';
// const API_URL = 'https://d2w0hjrwcifnrg.cloudfront.net/';

// ===============================================

export { isDevEnv, loginURL, LOGIN_PATH, API_URL }