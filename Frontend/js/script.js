import { LOGIN_PATH, API_URL, logOutURL } from "./config.js";

var HasNewTaskBeenClicked = 0;

document.getElementById('new-task-button').addEventListener('click', function () {
  NewTaskClicked(false, null);
});
document.getElementById('logout-button').addEventListener('click', function () {
  LogMeOut();
});

// ============== Config ================
var uid = 1;
let popUp = document.getElementById('db-error-pop-up');
let popUpButton = document.getElementById('db-error-button');

const loginPath = LOGIN_PATH;
const apiEndpoint = API_URL;
const injectionKeywords = ['DROP', 'ALTER', 'INNER', 'JOIN', 'DELETE', 'UNION', 'FETCH', 'DELCARE', 'TABLE', 'Tasks', 'Boards', 'Users', 'UserId', 'TaskId', 'BoardId', 'Deleted', 'script'];
const injectionCharacters = ['=', '--', ';', '*', '\\', '<', '>'];

popUpButton.addEventListener('click', function(){
  popUp.style.display = "none";
});

function getTokens() {
  // Check if tokens are in the URL fragment
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const idToken = hashParams.get('id_token');
  const accessToken = hashParams.get('access_token');

  if (idToken && accessToken) {
    // Save tokens to session storage
    sessionStorage.setItem('idToken', idToken);
    sessionStorage.setItem('accessToken', accessToken);
    // Remove tokens from URL
    window.history.replaceState({}, document.title, window.location.pathname);
  } else {
    // Tokens not found in URL, check session storage
    const storedIdToken = sessionStorage.getItem('idToken');
    const storedAccessToken = sessionStorage.getItem('accessToken');

    if (!(storedIdToken && storedAccessToken)) {
    } else {
      window.location.href = loginPath;
    }
  }
}

// This checks to see if the token has expired or not, if so it redirects to login
function checkToken() {
  let token = sessionStorage.getItem('idToken');

  if (!token) {
    // Redirect to login
    window.location.href = loginPath;
    return;
  }

  // Decode the token
  let decodedToken = parseJwt(token);

  // Get the expiration time from the decoded token
  let expirationTime = decodedToken.exp;

  // Get the current time in seconds
  let currentTime = Math.floor(Date.now() / 1000);
  // Check if the token has expired
  if (currentTime >= expirationTime) {
    // Token has expired, redirect to login
    const params = new URLSearchParams();
    params.append('expired', 'true');
    const loginUrlWithParams = `${loginPath}?${params.toString()}`;
    window.location.href = loginUrlWithParams;
    return;
  }
}

// Function to parse JWT tokens
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

window.onload = async () => {
  getTokens();
  await buildBoard();
};

async function fetchWithAuth(endpoint, options = {}) {
  checkToken();
  const headers = new Headers(options.headers || {});

  const token = sessionStorage.getItem('idToken');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let url = apiEndpoint + endpoint;
  let result = await fetch(url, {
    ...options,
    headers,
  });
  if (result.status == 401) {
    const params = new URLSearchParams();
    params.append('unauthorized', 'true');
    const loginUrlWithParams = `${loginPath}?${params.toString()}`;
    window.location.href = loginUrlWithParams;
  } else if(result.status == 400) {
    //display UI here
    popUp.style.display = "block";

  } else if(result.status == 200){
    return result
  };
}

async function loadTasks() {
  let userTitles = [];
  let userDescriptions = [];
  let userDates = [];
  let userStatus = [];
  let userTaskIds = [];

  let response = await fetchWithAuth(`ProgressBoard/UserTasks`);
  let tasks = await response.json();
  for (var task of tasks) {
    userTaskIds.push(task.taskId);
    userStatus.push(task.status);
    userDates.push(task.date);
    userTitles.push(task.taskName);
    userDescriptions.push(task.taskDescription);
  }
  return { userTitles, userDescriptions, userDates, userStatus, userTaskIds };
}

function isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|avantgo|blackberry|bada\/|bb10|blazer|compal|elaine|fennec|hiptop|iemobile|ipad|iphone|ipod|iris|kindle|lge |maemo|midp|mmp|mobile|netfront|nokia|opera mini|opera mobi|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent);
  }

async function buildBoard() {
  destroyBoard();
  const loadingElement = document.getElementById("loading-element");
  loadingElement.style.display = "block"; 

  // Load all tasks
  let { userTitles, userDescriptions, userDates, userStatus, userTaskIds } = await loadTasks();

  for (let index = 0; index < userTaskIds.length; index++) {
    const sec = document.createElement("section");
    sec.classList.add("card");

    if(!isMobile()){
        sec.setAttribute('draggable', 'true');
    }
    sec.id = "card-" + String(userTaskIds[index]); // Will use later when moving and deleting
    sec.setAttribute("taskId", userTaskIds[index]);

    const headerSection = document.createElement('section');
    headerSection.classList.add('card-header');

    const title = document.createElement('h2');
    title.classList.add('card-title');
    title.innerText = userTitles[index];
    sec.setAttribute("title", userTitles[index]);
    headerSection.appendChild(title);

    const menuContainer = document.createElement('section');
    menuContainer.classList.add('menu-container');

    const ellipsis = document.createElement('section');
    ellipsis.classList.add('ellipsis');
    ellipsis.innerText = '...';

    const menu = document.createElement('section');
    menu.classList.add('menu');

    const btnEdit = document.createElement('button');
    btnEdit.classList.add('menu-item');
    btnEdit.id = 'edit-button-' + String(userTaskIds[index]);
    btnEdit.innerText = 'Edit';
    btnEdit.onclick = function () {
      editTask(document.getElementById('card-' + String(userTaskIds[index])));
    };

    const btnDelete = document.createElement('button');
    btnDelete.classList.add('menu-item');
    btnDelete.id = 'delete-button-' + String(userTaskIds[index]);
    btnDelete.innerText = 'Delete';
    btnDelete.onclick = function () {
        btnDelete.disabled = true;
        deleteTask(document.getElementById("card-" + String(userTaskIds[index])));
        sec.remove();
    };

    menu.appendChild(btnEdit);
    menu.appendChild(btnDelete);
    menuContainer.appendChild(ellipsis);
    menuContainer.appendChild(menu);
    headerSection.appendChild(menuContainer);

    sec.appendChild(headerSection);

    const description = document.createElement("p");
    description.classList.add("card-description");
    description.innerText = userDescriptions[index];
    sec.setAttribute("description", userDescriptions[index]);
    sec.appendChild(description);

    const dateSection = document.createElement('section');
    dateSection.classList.add('date-section');

    const date = document.createElement('p');
    date.classList.add('card-date');
    date.innerText = userDates[index];
    dateSection.appendChild(date);

    const btnMove = document.createElement('button');
    btnMove.classList.add('card-button');
    btnMove.id = 'move-button-' + String(userTaskIds[index]);
    btnMove.innerText = 'Advance';
    btnMove.onclick = function () { 

      btnMove.disabled = true;
      try {
        // Execute the task
       moveTask(document.getElementById('card-' + String(userTaskIds[index])));
      } catch (error) {
        console.error('An error occurred while moving the task:', error);
        btnMove.disabled = false;
      } 
    };
    dateSection.appendChild(btnMove);

    sec.appendChild(dateSection);

    switch (userStatus[index]) {
      case "TODO":
        sec.setAttribute("boardId", "TODO");
        var board = document.getElementById("to-do-board");
        board.appendChild(sec);
        break;
      case "IN PROGRESS":
        sec.setAttribute("boardId", "IN PROGRESS");
        var board = document.getElementById("in-progress-board");
        board.appendChild(sec);
        break;
      case "DONE":
        sec.setAttribute("boardId", "DONE");
        btnMove.innerText = "Reopen";
        var board = document.getElementById("done-board");
        board.appendChild(sec);
        break;
      default:
        break;
    }
  }
  loadingElement.style.display = "none";
}

function editTask(cardSection) {
  if (!HasNewTaskBeenClicked) {
    NewTaskClicked(true, cardSection);
  }
  // Prepop fields
  const taskTitleField = document.getElementById("title-input");
  taskTitleField.value = cardSection.getAttribute("title");
  const taskDescriptionField = document.getElementById("description-input");
  taskDescriptionField.value = cardSection.getAttribute("description");
}

let draggedElement = null;

document.addEventListener('dragstart', function(event) {
  draggedElement = event.target;
  event.dataTransfer.setData('text/plain', draggedElement.id);
  
});

document.addEventListener('dragover', function(event) {
  event.preventDefault();
});

document.addEventListener('drop', async function(event) {
    event.preventDefault();
    if (event.target.classList.contains('board')) {
        const taskId = draggedElement.getAttribute('taskid');
        const newBoardId = event.target.getAttribute('id');

        // Update the boardId attribute of the dragged element to reflect the new board
        let newStatus;
        let jsonData;
        switch (newBoardId) {
            case "to-do-board":
                newStatus = "TODO";
                jsonData = { taskId: taskId, newStatus: "TODO" };
                break;
            case "in-progress-board":
                newStatus = "IN PROGRESS";
                jsonData = { taskId: taskId, newStatus: "IN PROGRESS" };
                break;
            case "done-board":
                newStatus = "DONE";
                jsonData = { taskId: taskId, newStatus: "DONE" };
                break;
            default:
                newStatus = draggedElement.getAttribute('boardid');
                break;
        }

        draggedElement.setAttribute('boardid', newStatus);

        // Append the card to the target board
        event.target.appendChild(draggedElement);
        const button = draggedElement.querySelector('.card-button');
        switch (newStatus) {
            case "TODO":
                button.textContent = "Advance";
                break;
            case "IN PROGRESS":
                button.textContent = "Advance";
                break;
            case "DONE":
                button.textContent = "Reopen";
                break;
        }

        // Call moveTask to update the task in the database
        //await moveTask(draggedElement);
        try {
            const response = await fetchWithAuth(`ProgressBoard/UpdateTask`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(jsonData),
            });
            if (!response.ok) {
              throw new Error("API error: " + response.text());
            }
          } catch (err) {
            throw new Error("Frontend error: " + err.message);
          }
        

        draggedElement = null;
    }
});


async function moveTask(cardSection) {
  const taskId = parseInt(cardSection.getAttribute("taskId"));
  const boardId = cardSection.getAttribute("boardId");
  let jsonData = {};
  switch (boardId) {
    case "TODO":
      // Update the boardId in the 'Tasks' table from 1 to 2
      jsonData = { taskId: taskId, newStatus: "IN PROGRESS" };
      break;
    case "IN PROGRESS":
      jsonData = { taskId: taskId, newStatus: "DONE" };
      break;
    case "DONE":
      jsonData = { taskId: taskId, newStatus: "TODO" };
      break;
    default:
      break;
  }
  // Send PUT request
  try {
    const response = await fetchWithAuth(`ProgressBoard/UpdateTask`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });
    if (!response.ok) {
      throw new Error("API error: " + response.text());
    }
  } catch (err) {
    throw new Error("Frontend error: " + err.message);
  }

  // Reload the board from the DB with the now updated boardId in the Tasks table (which we did in the switch)
  await buildBoard();
}

async function postTask() {
  const title = document.getElementById("title-input").value;
  if (title.length > 50) return;
  const description = document.getElementById("description-input").value;
  if (description.length > 200) return;
  if (title == "" || description == "") {
    return;
  }

  const loadingElement = document.getElementById("loading-element");
  loadingElement.style.display = "block"; 

  let jsonData = {
    taskId: 0,
    userId: uid,
    status: "TODO",
    taskName: title,
    taskDescription: description,
    date: new Date().toISOString(),
    deleted: false,
  };
  try {
    const response = await fetchWithAuth(`ProgressBoard/AddTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });
    if (!response.ok) {
      throw new Error("API error: " + response.text());
    }
  } catch (err) {
    throw new Error("Frontend error: " + err.message);
  }finally {
    loadingElement.style.display = "none"; // Hide the loading element
  }

  // Destroy the board
  destroyBoard();
  // Reload the board from the DB with the now updated boardId in the Tasks table (which we did in the switch)
  buildBoard();
}

function validateInput(input){
  input = input.toUpperCase();
  // Check for basic injection commands
  for (let keyword of injectionKeywords){
    if (input.includes(keyword.toUpperCase())) return false;
  }
  // Check for characters commonly used in injections
  for (let keyword of injectionCharacters){
    if (input.includes(keyword.toUpperCase())) return false;
  }
  return true;
}

async function updateTaskOnDB(cardSection) {
  const title = document.getElementById("title-input").value;
  const taskId = parseInt(cardSection.getAttribute("taskId"));
  if (title.length > 50) return;

  const description = document.getElementById("description-input").value;
  if (description.length > 200) return;
  if (title == "" || description == "") {
    return;
  }
  if (!validateInput(title) || !validateInput(description)) {
    return;
  }

  if (title == "" || description == "") {
    return;
  }
  const loadingElement = document.getElementById("loading-element");
  loadingElement.style.display = "block"; 

  let jsonData = {
    TaskId: taskId,
    NewDescription: description,
    NewName: title
  };
  try {
    const response = await fetchWithAuth(`ProgressBoard/UpdateTask`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });
    if (!response.ok) {
      throw new Error("API error: " + response.text());
    }
  } catch (err) {
    throw new Error("Frontend error: " + err.message);
  }finally {
    loadingElement.style.display = "none"; // Hide the loading element
  }

  // Destroy the board
  destroyBoard();
  // Reload the board from the DB with the now updated boardId in the Tasks table (which we did in the switch)
  buildBoard();
}

// We could probably have used the UpdateTask function for this, but it would have required some extra logic to distiguish between a move/delete
async function deleteTask(cardSection) {
  const taskId = parseInt(cardSection.getAttribute("taskId"));
  await fetchWithAuth(`ProgressBoard/DeleteTask/${taskId}`, {
    method: "PUT",
  });

  //commented these out becasue then we dont get delay
  // Destroy the board
  //destroyBoard();
  // Reload the board from the DB with the now updated boardId in the Tasks table (which we did in the switch)
 // buildBoard();
}

function destroyBoard() {
  var board = document.getElementById("to-do-board");
  if (board) {
    // Remove board
    board.remove();
    // Rebuild board
    let newBoard = document.createElement("section");
    newBoard.classList.add("board");
    newBoard.id = "to-do-board";
    let newBoardHeading = document.createElement("h2");
    newBoardHeading.classList.add("board-heading");
    newBoardHeading.innerText = "ToDo";
    newBoard.appendChild(newBoardHeading);
    // Re-add board to container
    var boardContainer = document.getElementById("board-container");
    boardContainer.appendChild(newBoard);
  }

  board = document.getElementById("in-progress-board");
  if (board) {
    board.remove();
    let newBoard = document.createElement("section");
    newBoard.classList.add("board");
    newBoard.id = "in-progress-board";
    let newBoardHeading = document.createElement("h2");
    newBoardHeading.classList.add("board-heading");
    newBoardHeading.innerText = "In Progress";
    newBoard.appendChild(newBoardHeading);
    var boardContainer = document.getElementById("board-container");
    boardContainer.appendChild(newBoard);
  }

  board = document.getElementById("done-board");
  if (board) {
    board.remove();
    let newBoard = document.createElement("section");
    newBoard.classList.add("board");
    newBoard.id = "done-board";
    let newBoardHeading = document.createElement("h2");
    newBoardHeading.classList.add("board-heading");
    newBoardHeading.innerText = "Done";
    newBoard.appendChild(newBoardHeading);
    var boardContainer = document.getElementById("board-container");
    boardContainer.appendChild(newBoard);
  }
}

function NewTaskClicked(editTaskBool, cardSection) {
  if (!HasNewTaskBeenClicked) {
    HasNewTaskBeenClicked = 1;
    const backdrop = document.createElement("section");
    backdrop.classList.add("create-task-backdrop");
    document.body.appendChild(backdrop);

    const sec = document.createElement("section");
    sec.classList.add("task-create-container");
    backdrop.appendChild(sec);

    const headerSection = document.createElement("section");
    headerSection.classList.add("create-task-header-section");

    const newTaskName = document.createElement("h2");

    if (editTaskBool) {
      newTaskName.innerText = "Edit task";
    } else {
      newTaskName.innerText = "Create new task";
    }

    headerSection.appendChild(newTaskName);

    const closeButton = document.createElement("button");
    closeButton.classList.add("close-button");
    closeButton.innerText = "X";
    closeButton.onclick = function () {
      backdrop.remove();
      HasNewTaskBeenClicked = 0;
    };
    headerSection.appendChild(closeButton);

    sec.appendChild(headerSection);

    const titleSection = document.createElement("section");
    titleSection.classList.add("create-task-input-section");

    const titleSectionName = document.createElement("h3");
    titleSectionName.innerText = "Task name";
    titleSection.appendChild(titleSectionName);

    const titleInput = document.createElement("input");
    titleInput.classList.add("title-input");
    titleInput.id = "title-input";
    titleInput.placeholder = "Enter task title";
    titleInput.type = "text";
    titleInput.autocomplete = "off";
    titleInput.maxLength = "50";

    // Conditionally set the required attribute
    if (!editTaskBool) {
      titleInput.required = true;
    }

    titleSection.appendChild(titleInput);

    sec.appendChild(titleSection);

    const descriptionSection = document.createElement("section");
    descriptionSection.classList.add("create-task-input-section");

    const descriptionSectionName = document.createElement("h3");
    descriptionSectionName.innerText = "Task description";
    descriptionSection.appendChild(descriptionSectionName);

    const descriptionInput = document.createElement("input");
    descriptionInput.classList.add("description-input");
    descriptionInput.id = "description-input";
    descriptionInput.placeholder = "Description";
    descriptionInput.type = "text";
    descriptionInput.autocomplete = "off";
    descriptionInput.maxLength = "200";

    // Conditionally set the required attribute
    if (!editTaskBool) {
      descriptionInput.required = true;
    }

    descriptionSection.appendChild(descriptionInput);

    sec.appendChild(descriptionSection);

    const createButton = document.createElement("button");
    createButton.classList.add("task-create-button");
    if(editTaskBool){
      createButton.innerText = "Save";
    }else{
      createButton.innerText = "Create";
    }
    

    createButton.onclick = function () {
      if (!editTaskBool && (!titleInput.value || !descriptionInput.value)) {
        if(!titleInput.value){
          titleInput.classList.add("create-task-input-error");
        }

        if(!descriptionInput.value){
          descriptionInput.classList.add("create-task-input-error");
        }
        
        
      }else{
        if (editTaskBool) {
          //we edit the task
          updateTaskOnDB(cardSection);
            
        } else {
          postTask();
        }
        backdrop.remove();
      }
      
    }
    sec.appendChild(createButton);

    HasNewTaskBeenClicked = 0;
  } else {
    const backdrop = document.querySelector(".create-task-backdrop");
    backdrop.remove();
    HasNewTaskBeenClicked = 0;
  }
}

function LogMeOut(){
  const url = logOutURL;
  sessionStorage.clear();
  window.location.href = url;
  return;
}
