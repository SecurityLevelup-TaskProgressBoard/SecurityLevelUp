var HasNewTaskBeenClicked = 0;

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