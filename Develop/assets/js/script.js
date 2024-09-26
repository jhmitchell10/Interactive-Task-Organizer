// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  if (!nextId) {
    nextId = 1;
} else {
    nextId++;
}
localStorage.setItem("nextId", JSON.stringify(nextId));
return nextId;
}

function readTasksFromStorage() {
let tasks = JSON.parse(localStorage.getItem("tasks"));
if (!tasks) {
    tasks = [];
}
return tasks;
}

function saveTasksToStorage(tasks) {
localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Todo: create a function to create a task card
function createTaskCard(task) {
const taskCard = $('<div>')
    .addClass('card mb-3')
    .attr('data-task-id', task.id);
    const cardHeader = $('<div>')
    .addClass('card-header')
    .text(task.title);
    const cardBody = $('<div>')
    .addClass('card-body');
    const cardDescription = $('<p>') 
    .addClass('card-text')
    .text(task.description);
    const cardDueDate = $('<p>')
    .addClass('card-text')
    .text(`Due: ${task.dueDate}`);
    const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete-btn')
    .text('Delete')
    .attr('data-task-id', task.id);
    cardDeleteBtn.on('click', handleDeleteTask);


if (project.dueDate && project.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(project.dueDate, 'DD/MM/YYYY');

    // ? If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }

  // ? Gather all the elements created above and append them to the correct elements.
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  // ? Return the card so it can be appended to the correct lane.
  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
 const todoList = $('#todo-cards');
  const inProgressList = $('#in-progress-cards');
  const doneList = $('#done-cards');

  // ? Clear existing cards
  todoList.empty();
  inProgressList.empty();
  doneList.empty();

  // ? Loop through the task list and create cards for each task
  taskList.forEach(task => {
    const taskCard = createTaskCard(task);
    if (task.status === 'todo') {
      todoList.append(taskCard);
    } else if (task.status === 'in-progress') {
      inProgressList.append(taskCard);
    } else if (task.status === 'done') {
      doneList.append(taskCard);
    }
  });
  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
    helper: function (e) {
      // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
      // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}


// Todo: create a function to handle adding a new task
function handleAddTask(event){
const taskTitle = $('#task-title').val().trim();
const taskDescription = $('#task-description').val().trim();
const taskDueDate = $('#task-due-date').val().trim();
const newTask = {
  id: generateTaskId(),
  title: taskTitle,
  description: taskDescription,
  dueDate: taskDueDate,
  status: 'todo',
};
 console.log(data);

 const savedtasks = JSON.parse(localStorage.getItem('tasks')) || [];
 savedtasks.push(data);
 localStorage.setItem('tasks', JSON.stringify(savedtasks));
 window.location.reload();
}
 

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
const taskID = $(this).attr('data-task-id');
taskList = taskList.filter(task => task.id !== taskID);
localStorage.setItem('tasks', JSON.stringify(taskList));

renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable[0].dataset.taskId;

  const newStatus = event.target.id;

  const tasks = readTasksFromStorage();

  console.log(taskId);

  console.log(newStatus);

  for (let task of tasks) {
      if (task.id == taskId) {
      task.status = newStatus;
      }
  }

  saveTasksToStorage(tasks);
  renderTaskList();
}

$('#add-task-form').on('submit', handleAddTask);


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
        renderTaskList();
    
        $('#Task-Due').datepicker({
          changeMonth: true,
          changeYear: true,
      })
  
      $('.lane').droppable({
          accept: '.draggable',
          drop: handleDrop
      });
    });
