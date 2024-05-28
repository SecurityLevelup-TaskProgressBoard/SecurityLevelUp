var HasNewTaskBeenClicked = 0;
// var userTitles = [];  // <-- uncomment for when endpoints are done
// var userDescriptions = [];
// var userDates = [];
// var userStatus = [];
// var userTaskIds = [];
// DEBUG *******
var userTitles = ['Card Title', 'Spiderman sighted in brooklyn swinging from webs', 'A Card Title that is very long and too long actually', 'Last One'];
var userDescriptions = ['This is a description of the card. It provides some information about the content of the card.', 'The dog needs to be washed and groomed. Remember to buy new shampoo as well, and to use luke warm water. The dog needs to be washed and groomed. Remember to buy new shampoo as well, and to use luke warm water.', 'This is a description of the card. It provides some information about the content of the card.', 'Last descitpion of what happened'];
var userDates = ['27 May 2024 17:00', '25 May 2024 09:00', '28 May 2024 10:40', '15 May 2024 21:55']
var userStatus = ['ToDo', 'In Progress', 'Done', 'ToDo'];  // TODO: <-- This needs to be mapped from the int boardId to Status somehow
var userTaskIds = [1, 2, 3, 4];
// ***********
window.onload = () => {
    buildBoard();
}

// This will become async once we call the endpoint in here to get all the user's tasks
function loadTasks() {
    // All this should be dynamically loaded using whichever endpoints. For now the user arrays are hardcoded above.
    // TODO: call GET method to get all tasks for specific user id. e.g. /api/v1/getTasks/{userId}
    // The resulting records should all be stored in the user arrays exactly as they are hardcoded above.
}

function buildBoard() {
    // Clear board for when cards already exists
    destroyBoard();
    // Load all tasks
    loadTasks();
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
            case 'ToDo':
                sec.setAttribute('boardId', 'ToDo');
                var board = document.getElementById('to-do-board');
                board.appendChild(sec);
                break;
            case 'In Progress':
                sec.setAttribute('boardId', 'In Progress');
                var board = document.getElementById('in-progress-board');
                board.appendChild(sec);
                break;
            case 'Done':
                sec.setAttribute('boardId', 'Done');
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

function moveTask(cardSection){
    const taskId = cardSection.getAttribute('taskId') | 0; // <-- Convert to int
    const boardId = cardSection.getAttribute('boardId');

    switch (boardId) {
        case 'ToDo':
            // Update the boardId in the 'Tasks' table from 1 to 2
            // TODO: Call endpoint to just update the boardId of the relevant taskId. Something like /api/v1/updateStatus/{taskId}/{newStatus} 
            
            // Debug code ********************************
            var indexOfTaskId = userTaskIds.indexOf(taskId);
            userStatus[indexOfTaskId] = 'In Progress';
            // ********************************
            break;
        case 'In Progress':
            // Update the boardId in the 'Tasks' table from 2 to 3
            // TODO
            
            // Debug code ********************************
            var indexOfTaskId = userTaskIds.indexOf(taskId);
            userStatus[indexOfTaskId] = 'Done';
            // ********************************
            break;
        case 'Done':
            // Update the boardId in the 'Tasks' table from 3 to 1
            // TODO
            
            // Debug code ********************************
            var indexOfTaskId = userTaskIds.indexOf(taskId);
            userStatus[indexOfTaskId] = 'ToDo';

            // ********************************
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
        // Readd board to container
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