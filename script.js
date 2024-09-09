const addTaskBtn = document.getElementById('add-task-btn');
const addTaskDesktop = document.getElementById('btn-desktop');
const taskModal = document.getElementById('task-modal');
const closeModalBtns = taskModal.querySelectorAll('.delete, #cancel-task-btn');
const saveTaskBtn = document.getElementById('save-task-btn');
const taskForm = document.getElementById('task-form');
const darkMode = document.getElementById('modo-oscuro');
let editingTask = null;
let mode = "Light";                   
let tasks = [];

//Get Tasks
getTasks = async () => {
    try{
        const response = await fetch("http://localhost:3000/api/tasks");
        if(response.ok){
            tasks = await response.json();
            console.log(tasks); 
        }
    }
    catch(error){
        console.log(error);
    }
}

//Post Task
postTask = async (task) => {
    try{
        const response = await fetch("http://localhost:3000/api/tasks", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify(task)
        });
    }
    catch(error){
        console.log(error);
    }
}


//Put Task
putTask = async (task) => {
    try{
        const response = await fetch(`http://localhost:3000/api/tasks/${task.id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify(task)
        });
        if(response.ok){
            tasks = await response.json();
            console.log(tasks); 
        }
    }
    catch(error){
        console.log(error);
    }
}

//Delete Task
deleteTask = async (task) => {
    try{
        const response = await fetch(`http://localhost:3000/api/tasks/${task.id}`, {
            method: 'DELETE'
        });
        if(response.ok){
            console.log(tasks); 
        }
    }
    catch(error){
        console.log(error);
    }
}



//Renderizar Tareas
async function renderTasks(){
    //Limpiar las columnas
    document.querySelectorAll('.task').forEach(task => {
        task.remove();
    })

    //Renderizar las tareas desde el backend
    await getTasks();
    tasks.forEach(task => {
        document.querySelectorAll('.subtitle').forEach(column => {
            if (task.status.trim().toLowerCase() === column.textContent.trim().toLowerCase()) {
                const taskCard = document.createElement('div');
                taskCard.className = 'task';
                taskCard.draggable = true;
                taskCard.innerHTML = `
                <div class="task-title">${task.title}</div>
                <p class="task-description">Descripción: ${task.description}</p>
                <p class="task-assigned">Asignado a: ${task.assignedTo}</p>
                <p class="task-priority">Prioridad: ${task.priority}</p>
                <p class="task-due-date">Fecha límite: ${task.endDate}</p>
                <button class="deleteButton"></button>
                `;

                // Añadir evento de clic para abrir el modal de edición de la tarea
                taskCard.addEventListener('click', function () {
                    try{
                        openTaskModalForEditing(parseInt(task.id), task);
                    }
                    catch(error){
                        console.log("Hubo un error al intentar editar la tarea: " + error);
                    }
                   
                });

                // Añadir eventos de drag and drop
                taskCard.addEventListener('dragstart', () => {
                    currentDragItem = taskCard;
                });

                taskCard.addEventListener('dragend', () => {
                    currentDragItem = null;
                });

                // Añadir evento de clic para eliminar la tarea
                taskCard.querySelector('.deleteButton').addEventListener('click', async function (event) {
                    event.stopPropagation();
                    await deleteTask(task);
                    renderTasks();
                });

                column.parentNode.appendChild(taskCard);
            }
        })
    });
}

// Abrir modal de nueva tarea
addTaskBtn.addEventListener('click', () => {
    editingTask = null;
    taskForm.reset();
    taskModal.classList.add('is-active');
});

addTaskDesktop.addEventListener('click', () => {
    editingTask = null;
    taskForm.reset();
    taskModal.classList.add('is-active');
});

// Cerrar modal
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        taskModal.classList.remove('is-active');
    });
});

// Guardar tarea
saveTaskBtn.addEventListener('click', async () => {
    if (!taskForm.checkValidity()){
        taskForm.reportValidity();
        return;
    }

    const taskData = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        assignedTo: document.getElementById('task-assigned').value,
        startDate: new Date(),
        endDate: document.getElementById('task-due-date').value,
        status: document.getElementById('task-status').value ,
        priority: document.getElementById('task-priority').value ,
    };
    if (editingTask) {
        taskData.id = editingTask.id;
        await putTask(taskData);
        renderTasks();
    } else {
        await postTask(taskData);
        renderTasks();
    }
    taskModal.classList.remove('is-active');
});


document.getElementById("modo-oscuro").addEventListener("click", function () {
    document.body.classList.toggle("light-mode");
    darkMode.classList.toggle("light-mode");
});

// Abrir modal para editar tarea
function openTaskModalForEditing(taskId, taskData) {
    taskModal.classList.add('is-active');
    document.querySelector('.modal-card-title').textContent = 'Editar Tarea';
    document.getElementById('task-title').value = taskData.title;
    document.getElementById('task-description').value = taskData.description;
    document.getElementById('task-assigned').value = taskData.assignedTo;
    document.getElementById('task-priority').value = taskData.priority;
    document.getElementById('task-status').value = taskData.status;
    document.getElementById('task-due-date').value = taskData.endDate;
    editingTask = tasks[taskId-1];
}


// Función de Cambio de Modo Claro/Oscuro
function changeMode() {
    if (mode === "Light") {

        // Modo oscuro
        document.documentElement.style.setProperty("--bar-color", "rgb(10, 44, 10)"); // Un verde más oscuro para la barra
        document.documentElement.style.setProperty("--title-color", "white");
        document.documentElement.style.setProperty("--background-color", "#121212"); // Fondo oscuro
        document.documentElement.style.setProperty("--font-color", "white"); // Texto blanco en modo oscuro
        document.documentElement.style.setProperty("--primary-color", "rgb(32, 102, 102)"); // Un tono más oscuro de verde-azulado
        document.documentElement.style.setProperty("--light-background", "#1e1e1e"); // Fondo ligeramente menos oscuro
        document.documentElement.style.setProperty("--very-light-background", "#333333"); // Fondo gris claro para contraste
        document.documentElement.style.setProperty("--create-task-button", "rgb(12, 100, 12)"); // Botón verde oscuro
        document.documentElement.style.setProperty("--create-task-hover", "rgb(8, 72, 8)"); // Hover más oscuro
        document.documentElement.style.setProperty("--dark-mode-color", "yellow"); // Un gris claro para el icono del modo oscuro
        document.documentElement.style.setProperty("--dark-mode-hover", "gold"); // Un gris medio para hover
        document.documentElement.style.setProperty("--delete-btn-color", "darkgrey"); // Botón de eliminar gris oscuro
        document.documentElement.style.setProperty("--delete-btn-hover", "darkred"); // Hover rojo oscuro

        mode = "Dark";
    } else {

        // Modo claro
        document.documentElement.style.setProperty("--bar-color", "rgb(12, 64, 12)");
        document.documentElement.style.setProperty("--title-color", "white");
        document.documentElement.style.setProperty("--background-color", "#e8e8e8");
        document.documentElement.style.setProperty("--font-color", "black");
        document.documentElement.style.setProperty("--primary-color", "rgb(52, 52, 154)");
        document.documentElement.style.setProperty("--light-background", "#efefef");
        document.documentElement.style.setProperty("--very-light-background", "#f8f8f8");
        document.documentElement.style.setProperty("--create-task-button", "rgb(17, 144, 17)");
        document.documentElement.style.setProperty("--create-task-hover", "rgb(4, 83, 4)");
        document.documentElement.style.setProperty("--dark-mode-color", "grey");
        document.documentElement.style.setProperty("--dark-mode-hover", "rgb(177, 188, 177)");
        document.documentElement.style.setProperty("--delete-btn-color", "grey");
        document.documentElement.style.setProperty("--delete-btn-hover", "red");

        mode = "Light";
    }
}


darkMode.addEventListener('click', () => {
    changeMode();
});

renderTasks();
