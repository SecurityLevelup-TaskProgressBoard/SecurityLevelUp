var HasNewTaskBeenClicked = 0;
let userTitles = []
let userDescriptions = []
let userDates = []
let userStatus = []
let userTaskIds = []

window.onload = async () => {
    await buildBoard();
}

const backendURL = "https://localhost:7033/"

async function fetchWithAuth(endpoint, options={}){
    const headers = new Headers(options.headers || {});
    let url = backendURL + endpoint;
    let result=  await fetch(url, {
        ...options,
        headers,
      });
      if (result.status==401) { alert("Error in calling BE");}
      else return result;
}

// This will become async once we call the endpoint in here to get all the user's tasks
async function loadTasks() {
    userTitles = []
    userDescriptions = []
    userDates = []
    userStatus = []
    userTaskIds = []

    var uid = 1;
    const response = await fetch(`https://localhost:7033/ProgressBoard/UserTasks/${uid}`);
    let tasks = await response.json();
    console.log(tasks);
    for (var task of tasks){
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
        const sec = document.createElement('section');
        sec.classList.add('card')
        sec.id = 'card-' + String(userTaskIds[index]);  // Will use later when moving and deleting 
        sec.setAttribute('taskId', userTaskIds[index]);

        const title = document.createElement('h2');
        title.classList.add('card-title')
        title.innerText = userTitles[index];
        sec.setAttribute('title', userTitles[index]);
        sec.appendChild(title);

        const description = document.createElement('p');
        description.classList.add('card-description');
        description.innerText = userDescriptions[index];
        sec.setAttribute('description', userDescriptions[index]);
        sec.appendChild(description);

        const date = document.createElement('p');
        date.classList.add('card-date');
        date.innerText = userDates[index];
        sec.appendChild(date);

        const btnMove = document.createElement('button');
        btnMove.classList.add('card-button');
        btnMove.id = 'move-button-' + String(userTaskIds[index]); // This is a bit redundant but might be useful later
        btnMove.innerText = 'Advance';
        btnMove.onclick = function() {moveTask(document.getElementById('card-' + String(userTaskIds[index])));};
        sec.appendChild(btnMove);

        const btnDelete = document.createElement('button');
        btnDelete.classList.add('card-button');
        btnDelete.id = 'delete-button-' + String(userTaskIds[index]);
        btnDelete.innerText = 'Delete';
        sec.appendChild(btnDelete);

        const btnEdit = document.createElement('button');
        btnEdit.classList.add('card-button');
        btnEdit.id = 'edit-button-' + String(userTaskIds[index]);
        btnEdit.innerText = 'Edit';
        btnEdit.onclick = function() {editTask(document.getElementById('card-' + String(userTaskIds[index])));};
        sec.appendChild(btnEdit);

        // Append the card to the relevant board section via its Status (derived from boardId in Tasks table, then Status in Boards table)
        switch (userStatus[index]) {
            case 'TODO':
                sec.setAttribute('boardId', 'TODO');
                var board = document.getElementById('to-do-board');
                board.appendChild(sec);
                break;
            case 'IN PROGRESS':
                sec.setAttribute('boardId', 'IN PROGRESS');
                var board = document.getElementById('in-progress-board');
                board.appendChild(sec);
                break;
            case 'DONE':
                sec.setAttribute('boardId', 'DONE');
                btnMove.innerText = 'Reopen';
                var board = document.getElementById('done-board');
                board.appendChild(sec);
                break;
            default:
                break;
        }
    }
}

function editTask(cardSection){
    const taskId = cardSection.getAttribute('taskId') | 0; // <-- Convert to int
    
    // Show new task fields
    const newTaskSection = document.getElementById('new-task-section'); 
    // NewTaskClicked(newTaskSection);
    if (!HasNewTaskBeenClicked) {
        NewTaskClicked(newTaskSection);
    }
    // Prepop fields
    const taskTitleField = document.getElementById('title-input');
    console.log(cardSection.getAttribute('title'));
    taskTitleField.value = cardSection.getAttribute('title');
    const taskDescriptionField = document.getElementById('description-input');
    taskDescriptionField.value = cardSection.getAttribute('description');

}

async function moveTask(cardSection){
    const taskId = parseInt(cardSection.getAttribute('taskId'));
    const boardId = cardSection.getAttribute('boardId');
    let jsonData = {};
    switch (boardId) {
        case 'TODO':
            // Update the boardId in the 'Tasks' table from 1 to 2
            // TODO: Call endpoint to just update the boardId of the relevant taskId. Something like /api/v1/updateStatus/{taskId}/{newStatus} 
            jsonData = {"taskId" : taskId, 
                        "status": "IN PROGRESS"};
            try{
                const response = await fetch(`https://localhost:7033/ProgressBoard/UpdateTask`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jsonData)
                });
                if (!response.ok) {
                    throw new Error('API error: ' + response.text());
                };
            }
            catch(err){
                throw new Error('Frontend error: ' + err.message);
            }
            break;
        case 'IN PROGRESS':
            jsonData = {"taskId" : taskId, 
            "status": "DONE"};
            try{
                const response = await fetch(`https://localhost:7033/ProgressBoard/UpdateTask`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jsonData)
                });
                if (!response.ok) {
                    throw new Error('API error: ' + response.text());
                };
            }
            catch(err){
                throw new Error('Frontend error: ' + err.message);
            }
            break;
        case 'DONE':
            jsonData = {"taskId" : taskId, 
            "status": "TODO"};
            try{
                const response = await fetch(`https://localhost:7033/ProgressBoard/UpdateTask`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jsonData)
                });
                if (!response.ok) {
                    throw new Error('API error: ' + response.text());
                };
            }
            catch(err){
                throw new Error('Frontend error: ' + err.message);
            }
        break;
        default:
            break;
    }

    // Destroy the board
    destroyBoard();
    // Reload the board from the DB with the now updated boardId in the Tasks table (which we did in the switch)
    buildBoard();
}

function destroyBoard(){
    var board = document.getElementById('to-do-board');
    if (board){
        // Remove board
        board.remove();
        // Rebuild board
        newBoard = document.createElement('section');
        newBoard.classList.add('board');
        newBoard.id = 'to-do-board';
        newBoardHeading = document.createElement('h2');
        newBoardHeading.classList.add('board-heading');
        newBoardHeading.innerText = 'ToDo';
        newBoard.appendChild(newBoardHeading);
        // Re-add board to container
        var boardContainer = document.getElementById('board-container');
        boardContainer.appendChild(newBoard);
    }

    board = document.getElementById('in-progress-board');
    if (board){
        board.remove();
        newBoard = document.createElement('section');
        newBoard.classList.add('board');
        newBoard.id = 'in-progress-board';
        newBoardHeading = document.createElement('h2');
        newBoardHeading.classList.add('board-heading');
        newBoardHeading.innerText = 'In Progress';
        newBoard.appendChild(newBoardHeading);
        var boardContainer = document.getElementById('board-container');
        boardContainer.appendChild(newBoard);
    }

    board = document.getElementById('done-board');
    if (board){
        board.remove();
        newBoard = document.createElement('section');
        newBoard.classList.add('board');
        newBoard.id = 'done-board';
        newBoardHeading = document.createElement('h2');
        newBoardHeading.classList.add('board-heading');
        newBoardHeading.innerText = 'Done';
        newBoard.appendChild(newBoardHeading);
        var boardContainer = document.getElementById('board-container');
        boardContainer.appendChild(newBoard);
    }
}

function NewTaskClicked(section) {
    if (!HasNewTaskBeenClicked) {
        // Create section
        const sec = document.createElement('section');
        sec.classList.add('task-create-container')
        sec.id = 'task-create-container';

        // Create task title input field
        const inp = document.createElement('input');
        inp.classList.add('title-input');
        inp.id = 'title-input';
        inp.placeholder = 'Enter task title';
        inp.type = 'text';
        inp.autocomplete = 'off';
        inp.maxLength = '50';
        sec.appendChild(inp);

        // Create task description textarea
        const ta = document.createElement('textarea');
        ta.classList.add('description-input');
        ta.id = 'description-input';
        ta.placeholder = 'Enter task description';
        ta.type = 'text';
        ta.maxLength = '200';
        sec.appendChild(ta);

        // Create post button
        const but = document.createElement('button');
        but.classList.add('card-button');
        but.innerText = 'Post';
        but.onclick = postTask;
        sec.appendChild(but);


        // Append the above to the section sent through as a parameter
        section.appendChild(sec);
        HasNewTaskBeenClicked = 1;
    }
    else {
        const sec = document.getElementById('task-create-container'); 
        sec.remove();
        HasNewTaskBeenClicked = 0;
    }
}

function postTask(){
    // TODO

    // TODO: Put lots of validation in here (like lengths, looking for '--', "'" etc.)
}