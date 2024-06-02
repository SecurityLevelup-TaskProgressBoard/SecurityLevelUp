var HasNewTaskBeenClicked = 0;
let userTitles = [];
let userDescriptions = [];
let userDates = [];
let userStatus = [];
let userTaskIds = [];
var uid = 1; // TODO: Get the correct user ID and remove hardcode from loadTasks function

function getTokens() {
    // Check if tokens are in the URL fragment
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const idToken = hashParams.get('id_token');
    const accessToken = hashParams.get('access_token');

    if(idToken && accessToken) {
        console.log("THERE BE TOKENS");
        // Save tokens to session storage
        sessionStorage.setItem('idToken', idToken);
        sessionStorage.setItem('accessToken', accessToken);

        console.log(sessionStorage.getItem('idToken'));
        console.log(sessionStorage.getItem('accessToken'));
        // Remove tokens from URL
        window.history.replaceState({}, document.title, window.location.pathname);

        // Redirect to a different page
        // window.location.href = 'https://localhost:5500/Frontend/index.html';
    } else {
        // Tokens not found in URL, check session storage
        const storedIdToken = sessionStorage.getItem('idToken');
        const storedAccessToken = sessionStorage.getItem('accessToken');

        if(storedIdToken && storedAccessToken) {
            console.log("TOKENS IN SESSION STORAGE!");
            //console.log(storedIdToken);
            //console.log(storedAccessToken);
        } else {
            // Tokens not found in session storage, redirect to login page
            console.log("NO TOKENS IN SESSION STORAGE!");
            window.location.href = 'https://localhost:5500/Frontend/login.html';
        }
    }
}

//this checks to see if the token has expired or not, if so it redirects to login
function checkToken(){
    let token = sessionStorage.getItem('idToken');

    if(!token){
        // Redirect to login
        window.location.href = 'https://localhost:5500/Frontend/login.html';
        return;
    }

    // Decode the token
    let decodedToken = parseJwt(token);

    // Get the expiration time from the decoded token
    let expirationTime = decodedToken.exp;
    console.log(expirationTime);

    // Get the current time in seconds
    let currentTime = Math.floor(Date.now() / 1000);
    console.log(currentTime);
    // Check if the token has expired
    if(currentTime >= expirationTime){
        // Token has expired, redirect to login
        console.log("TOKEN IS EXPIRED!");
        window.location.href = 'https://localhost:5500/Frontend/login.html';
        return;
    }

    // Token is still valid
    console.log('Token is still valid');
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

const backendURL = "https://localhost:7033/";//"http://localhost:5127/";

async function fetchWithAuth(endpoint, options = {}) {
    checkToken();
    const headers = new Headers(options.headers || {});
    //added the token part 
    const token = sessionStorage.getItem('idToken');
    console.log(token);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    let url = backendURL + endpoint;
    let result = await fetch(url, {
        ...options,
        headers,
    });
    if (result.status == 401) {
        alert("Error in calling BE");
    } else return result;
}

async function getEmail(){
    let response = await fetchWithAuth('ProgressBoard/email');
    let data = await response.text();
    console.log(data);
}

// This will become async once we call the endpoint in here to get all the user's tasks
async function loadTasks() {
  userTitles = [];
  userDescriptions = [];
  userDates = [];
  userStatus = [];
  userTaskIds = [];

  // TODO: Get the actual user id
  var uid = 1;
  //const response = await fetch(`${backendURL}ProgressBoard/UserTasks/${uid}`);
  let response = await fetchWithAuth(`ProgressBoard/UserTasks/${uid}`);
  let tasks = await response.json();
  console.log(tasks);
  for (var task of tasks) {
    userTaskIds.push(task.taskId);
    userStatus.push(task.status);
    userDates.push(task.date);
    userTitles.push(task.taskName);
    userDescriptions.push(task.taskDescription);
  }
  console.log(userTitles);
  console.log(userDescriptions);
  console.log(userDates);
  console.log(userStatus);
  console.log(userTaskIds);
}

async function buildBoard() {
  // Clear board for when cards already exists
  destroyBoard();
  // Load all tasks
  await loadTasks();

  for (let index = 0; index < userTaskIds.length; index++) {
    const sec = document.createElement("section");
    sec.classList.add("card");
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
    btnEdit.onclick = function() {
        editTask(document.getElementById('card-' + String(userTaskIds[index])));
    };

    const btnDelete = document.createElement('button');
    btnDelete.classList.add('menu-item');
    btnDelete.id = 'delete-button-' + String(userTaskIds[index]);
    btnDelete.innerText = 'Delete';
    btnDelete.onclick = function () {
        deleteTask(document.getElementById("card-" + String(userTaskIds[index])));
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
    btnMove.id = 'move-button-' + String(userTaskIds[index]); // This is a bit redundant but might be useful later
    btnMove.innerText = 'Advance';
    btnMove.onclick = function() {moveTask(document.getElementById('card-' + String(userTaskIds[index])));};
    dateSection.appendChild(btnMove);

    sec.appendChild(dateSection);

    // Append the card to the relevant board section via its Status (derived from boardId in Tasks table, then Status in Boards table)
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
}   

function editTask(cardSection) {
  // Show new task fields
  const newTaskSection = document.getElementById("new-task-section");

  if (!HasNewTaskBeenClicked) {
    NewTaskClicked(newTaskSection, true);
  }
  // Prepop fields
  const taskTitleField = document.getElementById("title-input");
  taskTitleField.value = cardSection.getAttribute("title");
  const taskDescriptionField = document.getElementById("description-input");
  taskDescriptionField.value = cardSection.getAttribute("description");
}

async function moveTask(cardSection) {
  const taskId = parseInt(cardSection.getAttribute("taskId"));
  const boardId = cardSection.getAttribute("boardId");
  let jsonData = {};
  switch (boardId) {
    case "TODO":
      // Update the boardId in the 'Tasks' table from 1 to 2
      // TODO: Call endpoint to just update the boardId of the relevant taskId. Something like /api/v1/updateStatus/{taskId}/{newStatus}
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
  // Destroy the board
  destroyBoard();
  // Reload the board from the DB with the now updated boardId in the Tasks table (which we did in the switch)
  buildBoard();
}

async function postTask() {
  // TODO: Put lots of validation in here (like lengths, looking for '--', "'" etc.)

  const title = document.getElementById("title-input").value;
  const description = document.getElementById("description-input").value;
  if (title == "" || description == "") {
    return;
  }
  console.log("Title: " + title + " Description: " + description);
  let jsonData = {
    taskId: 0,
    userId: uid,
    status: "TODO",
    taskName: title,
    taskDescription: description,
    date: new Date().toISOString(),
    deleted: false,
  };
  // Send POST request
  try {
    debugger;
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
  }

  // Destroy the board
  destroyBoard();
  // Reload the board from the DB with the now updated boardId in the Tasks table (which we did in the switch)
  buildBoard();
}
// We could probably have used the UpdateTask function for this, but it would have required some extra logic to distiguish between a move/delete
async function deleteTask(cardSection) {
  // alert('Delete functionality blocked, undo this in "deleteTask" function');
  // ********************
  // return; // DEBUG CODE, to prevent accidental deletions
  // ********************
  const taskId = parseInt(cardSection.getAttribute("taskId"));
  debugger;
  // TODO: This should most likely require a body for extra authentication
  await fetchWithAuth(`ProgressBoard/DeleteTask/${taskId}`, {
    method: "PUT",
  });

  // Destroy the board
  destroyBoard();
  // Reload the board from the DB with the now updated boardId in the Tasks table (which we did in the switch)
  buildBoard();
}

function destroyBoard() {
  var board = document.getElementById("to-do-board");
  if (board) {
    // Remove board
    board.remove();
    // Rebuild board
    newBoard = document.createElement("section");
    newBoard.classList.add("board");
    newBoard.id = "to-do-board";
    newBoardHeading = document.createElement("h2");
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
    newBoard = document.createElement("section");
    newBoard.classList.add("board");
    newBoard.id = "in-progress-board";
    newBoardHeading = document.createElement("h2");
    newBoardHeading.classList.add("board-heading");
    newBoardHeading.innerText = "In Progress";
    newBoard.appendChild(newBoardHeading);
    var boardContainer = document.getElementById("board-container");
    boardContainer.appendChild(newBoard);
  }

  board = document.getElementById("done-board");
  if (board) {
    board.remove();
    newBoard = document.createElement("section");
    newBoard.classList.add("board");
    newBoard.id = "done-board";
    newBoardHeading = document.createElement("h2");
    newBoardHeading.classList.add("board-heading");
    newBoardHeading.innerText = "Done";
    newBoard.appendChild(newBoardHeading);
    var boardContainer = document.getElementById("board-container");
    boardContainer.appendChild(newBoard);
  }
}

function NewTaskClicked(section, editTaskBool) {
    if (!HasNewTaskBeenClicked) {
      const backdrop = document.createElement("section");
      backdrop.classList.add("create-task-backdrop");
      document.body.appendChild(backdrop);
  
      const sec = document.createElement("section");
      sec.classList.add("task-create-container");
      backdrop.appendChild(sec);
  
      const headerSection = document.createElement("section");
      headerSection.classList.add("create-task-header-section");
  
      const newTaskName = document.createElement("h2");

      if(editTaskBool){
        newTaskName.innerText = "Edit task";
      }else{
        newTaskName.innerText = "Create new task";
      }
      
      headerSection.appendChild(newTaskName);
  
      const closeButton = document.createElement("button");
      closeButton.classList.add("close-button");
      closeButton.innerText = "X";
      closeButton.onclick = function() {
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
      descriptionInput.maxLength = "300";
      descriptionSection.appendChild(descriptionInput);
  
      sec.appendChild(descriptionSection);
  
      const createButton = document.createElement("button");
      createButton.classList.add("task-create-button");
      createButton.innerText = "Create";
      createButton.onclick = function(){
        postTask();
        backdrop.remove();
        
      } 
      sec.appendChild(createButton);
  
      HasNewTaskBeenClicked = 1;
    } else {
      const backdrop = document.querySelector(".create-task-backdrop");
      backdrop.remove();
      HasNewTaskBeenClicked = 0;
    }
  }
  
