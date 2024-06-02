
//const cognito = "https://taskify-secuirtylevelup.auth.eu-west-1.amazoncognito.com/oauth2/authorize?client_id=7clapqn1ahmris82jnsv8ku0c2&response_type=token&scope=email+openid&redirect_uri=http://localhost:5500/Frontend/login.html";


const loginURL = "https://taskify-secuirty.auth.eu-west-1.amazoncognito.com/oauth2/authorize?client_id=66lc4rli2hjagrads5atsjbumg&response_type=token&scope=email+openid+profile&redirect_uri=http://localhost:5500/Frontend/index.html"
function login(){
    window.location.href = loginURL;
}

function getTokens() {
    // Check if tokens are in the URL fragment
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const idToken = hashParams.get('id_token');
    const accessToken = hashParams.get('access_token');

    if(idToken && accessToken) {
        // Save tokens to session storage
        sessionStorage.setItem('idToken', idToken);
        sessionStorage.setItem('accessToken', accessToken);

        console.log(sessionStorage.getItem('idToken'));
        console.log(sessionStorage.getItem('accessToken'));
        // Remove tokens from URL
        window.history.replaceState({}, document.title, window.location.pathname);

        // Redirect to a different page
        // window.location.href = 'https://localhost:5500/Frontend/index.html';
    }
}


document.addEventListener('DOMContentLoaded', getTokens);