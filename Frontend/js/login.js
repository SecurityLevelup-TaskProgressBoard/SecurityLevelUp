import { loginURL } from "./config.js";
const infoText = document.getElementById('info-text');

function login() {
    window.location.href = loginURL;
}

function checkInfoParams(){
    const queryString = window.location.search;

    // Parse the query string
    const urlParams = new URLSearchParams(queryString);

    // Check and handle specific query parameters
    if (urlParams.has('expired') && urlParams.get('expired') === 'true') {
        infoText.innerText = "Your session has expired please login again."
    }else if(urlParams.has('unauthorized') && urlParams.get('unauthorized') === 'true') {
        infoText.innerText = "Something went wrong!"
    }else{
        infoText.innerText = "";
    }
}

//can be removed\\
// function getTokens() {
//     // Check if tokens are in the URL fragment
//     const hashParams = new URLSearchParams(window.location.hash.substring(1));
//     const idToken = hashParams.get('id_token');
//     const accessToken = hashParams.get('access_token');

//     if (idToken && accessToken) {
//         // Save tokens to session storage
//         sessionStorage.setItem('idToken', idToken);
//         sessionStorage.setItem('accessToken', accessToken);

//         console.log(sessionStorage.getItem('idToken'));
//         console.log(sessionStorage.getItem('accessToken'));
//         // Remove tokens from URL
//         window.history.replaceState({}, document.title, window.location.pathname);

//         // Redirect to a different page
//         // window.location.href = 'https://localhost:5500/Frontend/index.html';
//     }
// }


//document.addEventListener('DOMContentLoaded', getTokens);
document.addEventListener('DOMContentLoaded', checkInfoParams);
document.getElementById('login-button').addEventListener('click', login);