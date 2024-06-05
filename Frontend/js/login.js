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

document.addEventListener('DOMContentLoaded', checkInfoParams);
document.getElementById('login-button').addEventListener('click', login);