var HasNewTaskBeenClicked = 0;
var arrayTitles = [];
var arrayDescriptions = [];
var arrayDates = [];
var arrayStatus = [];
var arrayTaskIds = [];

window.onload = () => {
    buildBoard();
}

// This will become async once we call the endpoint in here to get all the user's tasks
function loadTasks() {
    arrayTitles = ['Card Title', 'Spiderman sighted in brooklyn swinging from webs', 'A Card Title that is very long and too long actually', 'Last One'];
    arrayDescriptions = ['This is a description of the card. It provides some information about the content of the card.', 'The dog needs to be washed and groomed. Remember to buy new shampoo as well, and to use luke warm water. The dog needs to be washed and groomed. Remember to buy new shampoo as well, and to use luke warm water.', 'This is a description of the card. It provides some information about the content of the card.', 'Last descitpion of what happened'];
    arrayDates = ['27 May 2024 17:00', '25 May 2024 09:00', '28 May 2024 10:40', '15 May 2024 21:55']
    arrayStatus = ['ToDo', 'In Progress', 'Done', 'ToDo'];  // <-- This needs to be mapped from the int boardId and Status somehow
    arrayTaskIds = [1, 2, 3, 4]; 
}

function buildBoard() {
    // Clear board for when cards already exists
    destroyBoard();

    // Get all titles
    loadTasks();
    for (let index = 0; index < arrayTaskIds.length; index++) {
        const sec = document.createElement('section');
        sec.classList.add('card')
        sec.id = 'card-' + String(arrayTaskIds[index]);  // Will use later when moving and deleting 

        const title = document.createElement('h2');
        title.classList.add('card-title')
        title.innerText = arrayTitles[index];
        sec.appendChild(title);

        const description = document.createElement('p');
        description.classList.add('card-description');
        description.innerText = arrayDescriptions[index];
        sec.appendChild(description);

        const date = document.createElement('p');
        date.classList.add('card-date');
        date.innerText = arrayDates[index];
        sec.appendChild(date);

        const btnMove = document.createElement('button');
        btnMove.classList.add('card-button');
        btnMove.id = 'move-button-' + String(arrayTaskIds[index]); // This is a bit redundant but might be useful later
        btnMove.innerText = 'Move';
        sec.appendChild(btnMove);

        const btnDelete = document.createElement('button');
        btnDelete.classList.add('card-button');
        btnDelete.id = 'delete-button-' + String(arrayTaskIds[index]);
        btnDelete.innerText = 'Delete';
        sec.appendChild(btnDelete);

        const btnEdit = document.createElement('button');
        btnEdit.classList.add('card-button');
        btnEdit.id = 'edit-button-' + String(arrayTaskIds[index]);
        btnEdit.innerText = 'Edit';
        sec.appendChild(btnEdit);

        // Append the card to the relevant board section via its Status (derived from boardId in Tasks table, then Status in Boards table)
        switch (arrayStatus[index]) {
            case 'ToDo':
                var board = document.getElementById('to-do-board');
                board.appendChild(sec);
                break;
            case 'In Progress':
                var board = document.getElementById('in-progress-board');
                board.appendChild(sec);
                break;
            case 'Done':
                var board = document.getElementById('done-board');
                board.appendChild(sec);
                break;
            default:
                break;
        }
    }
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
        inp.placeholder = 'Enter task title';
        inp.type = 'text';
        inp.autocomplete = 'off';
        inp.maxLength = '50';
        sec.appendChild(inp);
        inp.innerText = 'api call...';

        // Create task description textarea
        const ta = document.createElement('textarea');
        ta.classList.add('description-input');
        ta.placeholder = 'Enter task description';
        ta.type = 'text';
        ta.maxLength = '200';
        sec.appendChild(ta);

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

function MoveButtonClicked(button) {
    var buttonId = button.id;
    alert('Button ID: ' + (buttonId));
}