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
        if(response.ok){
            tasks = await response.json();
            console.log(tasks); 
        }
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
                    event.stopPropagation(); // Prevenir que se dispare el evento de editar tarea
                    await deleteTask(task); // Eliminar la tarjeta de tarea del DOM
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


// Agregamos un event listener para el botón de modo oscuro
document.getElementById("modo-oscuro").addEventListener("click", function () {
    // Alterna entre las clases 'light-mode' y 'dark-mode' (por defecto sin la clase es modo oscuro)
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        this.classList.add("light-mode");  // Cambia la imagen del botón para modo claro
    } else {
        this.classList.remove("light-mode");  // Cambia la imagen del botón para modo oscuro
    }
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


// Modo Oscuro
function changeMode() {
    if (mode === "Light") {

        document.documentElement.style.setProperty("--background-color", "#121212");
        document.documentElement.style.setProperty("--font-color", "white");
        document.documentElement.style.setProperty("--primary-color", "rgb(52, 154, 52)");
        document.documentElement.style.setProperty("--light-background", "#1e1e1e");
        document.documentElement.style.setProperty("--very-light-background", "#333333");
        document.documentElement.style.setProperty("--create-task-button", "#99e9f2");
        document.documentElement.style.setProperty("--create-task-", "#7bbcc4");

        mode = "Dark";
    }
    else {

        document.documentElement.style.setProperty("--background-color", "#e8e8e8");
        document.documentElement.style.setProperty("--font-color", "black");
        document.documentElement.style.setProperty("--primary-color", "rgb(52, 52, 154)");
        document.documentElement.style.setProperty("--light-background", "#efefef");
        document.documentElement.style.setProperty("--very-light-background", "#f8f8f8");
        document.documentElement.style.setProperty("--create-task-button", "#99e9f2");
        document.documentElement.style.setProperty("--create-task-hover", "#7bbcc4");

        mode = "Light";
    }
}

darkMode.addEventListener('click', () => {
    changeMode();
});

changeMode();
renderTasks();
