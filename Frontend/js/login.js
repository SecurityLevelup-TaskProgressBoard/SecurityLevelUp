import { loginURL } from "./config.js";

function login() {
    window.location.href = loginURL;
}

function getTokens() {
    // Check if tokens are in the URL fragment
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const idToken = hashParams.get('id_token');
    const accessToken = hashParams.get('access_token');

    if (idToken && accessToken) {
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
document.getElementById('login-button').addEventListener('click', login);