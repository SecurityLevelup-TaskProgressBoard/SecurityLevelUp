// ==============================================
//                    DEV
// ==============================================
const isDevEnv = true;

const loginURL = "https://taskify-secuirty.auth.eu-west-1.amazoncognito.com/oauth2/authorize?client_id=66lc4rli2hjagrads5atsjbumg&response_type=token&scope=email+openid+profile&redirect_uri=http://localhost:5500";
const logOutURL ="https://taskify-secuirty.auth.eu-west-1.amazoncognito.com/logout?client_id=66lc4rli2hjagrads5atsjbumg&logout_uri=http://localhost:5500";
const LOGIN_PATH = 'http://localhost:5500/login.html';
const API_URL = 'http://localhost:5000/';

export { isDevEnv, loginURL, LOGIN_PATH, API_URL, logOutURL }