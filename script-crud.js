const btnAddTask = document.querySelector('.app__button--add-task');
const formAddTask = document.querySelector('.app__form-add-task');
const deleteAddTask = document.querySelector('.app__form-footer__button--delete');
const cancelAddTask = document.querySelector('.app__form-footer__button--cancel');
const textArea = document.querySelector('.app__form-textarea');
const ulTasks = document.querySelector('.app__section-task-list');
const paragraphTaskDesc = document.querySelector('.app__section-active-task-description');

const btnRemoveTasksCompleted = document.getElementById("btn-remover-concluidas");
const btnRemoveTasksAll = document.getElementById("btn-remover-todas");

let taskS = JSON.parse(localStorage.getItem('taskS')) || [];
let selectedTask = null;
let liSelectedTask = null;

function updateTasks() {
    localStorage.setItem('taskS', JSON.stringify(taskS));
}

function clearForm() {
    textArea.value = '';
}

function hideForm() {
    formAddTask.classList.add('hidden');
}

function createElementTask(task) {
    const listItem = document.createElement('li');
    listItem.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `
    const paragraph = document.createElement('p');
    paragraph.classList.add('app__section-task-list-item-description');
    paragraph.textContent = task.description;

    const buttonEditTask = document.createElement('button');
    buttonEditTask.classList.add('app_button-edit');

    buttonEditTask.onclick = () => {
        // debugger
        const newDescription = prompt("Qual é o novo nome da tarefa?");
        if (newDescription) {
            paragraph.textContent = newDescription;
            task.description = newDescription;
            updateTasks();
        }
    }

    const imageButton = document.createElement('img');
    imageButton.setAttribute('src', '/imagens/edit.png');

    buttonEditTask.append(imageButton);

    listItem.append(svg, paragraph, buttonEditTask);

    if (task.completed) {
        listItem.classList.add('app__section-task-list-item-complete');
        buttonEditTask.setAttribute('disabled', true);
    } else {
        listItem.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active')/*.forEach(activeTask => {*/
                .forEach(activeTask => {
                    activeTask.classList.remove('app__section-task-list-item-active');
                });
            if (selectedTask == task) {
                paragraphTaskDesc.textContent = '';
                selectedTask = null;
                liSelectedTask = null;
                return;
            }
            selectedTask = task;
            liSelectedTask = listItem;
            paragraphTaskDesc.textContent = task.description;
            listItem.classList.add('app__section-task-list-item-active');
        }
    }

    return listItem;
}

btnAddTask.addEventListener('click', () => {
    formAddTask.classList.toggle('hidden');
});

deleteAddTask.addEventListener('click', clearForm());

cancelAddTask.addEventListener('click', () => {
    clearForm();
    hideForm();
});

formAddTask.addEventListener('submit', (event) => {
    event.preventDefault();
    const task = {
        description: textArea.value
    }
    taskS.push(task);
    const elementTask = createElementTask(task);
    ulTasks.append(elementTask);
    updateTasks();
    clearForm();
    hideForm();
});

taskS.forEach(task => {
    const elementTask = createElementTask(task);
    ulTasks.append(elementTask);
});

document.addEventListener('focoFinalizado', () => {
    if (selectedTask && liSelectedTask) {
        liSelectedTask.classList.remove('app__section-task-list-item-active');
        liSelectedTask.classList.add('app__section-task-list-item-complete');
        liSelectedTask.querySelector('button').setAttribute('disabled', true);
        selectedTask.completed = true;
        updateTasks();
    }
});

removeTasks = (onlyCompleted) => {
    const selector = onlyCompleted ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';
    document.querySelectorAll(selector).forEach(elementCSS => elementCSS.remove());
    taskS = onlyCompleted ? taskS.filter(taskElement => !taskElement.completed) : [];
    updateTasks();
}

btnRemoveTasksCompleted.onclick = () => removeTasks(true);
btnRemoveTasksAll.onclick = () => removeTasks(false);
