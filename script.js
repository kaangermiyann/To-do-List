// DOM Elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const clearTasksBtn = document.getElementById('clear-tasks-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Load tasks from local storage
document.addEventListener('DOMContentLoaded', loadTasks);

// Add Task
addTaskBtn.addEventListener('click', addTask);

// Clear All Tasks
clearTasksBtn.addEventListener('click', clearAllTasks);

// Filter Tasks
filterBtns.forEach(btn => btn.addEventListener('click', filterTasks));

// Add Task Function
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') return alert('Please enter a task!');
  
  const taskItem = createTaskItem(taskText);
  taskList.appendChild(taskItem);
  saveTasks(); // Save the task after adding it
  taskInput.value = ''; // Clear input field
}

// Create Task Item
function createTaskItem(text) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${text}</span>
    <div>
      <button onclick="editTask(this)">&#9998;</button>
      <button onclick="deleteTask(this)">&cross;</button>
      <button class="complete-btn" onclick="markComplete(this)">&check;</button> <!-- Added "Completed" button -->
    </div>
  `;
  li.addEventListener('click', toggleCompleted);
  return li;
}

// Edit Task
function editTask(button) {
  const taskItem = button.closest('li');
  const taskText = prompt('Edit your task:', taskItem.firstElementChild.innerText);
  if (taskText) {
    taskItem.firstElementChild.innerText = taskText;
    saveTasks();
  }
}

// Delete Task
function deleteTask(button) {
  button.closest('li').remove();
  saveTasks(); // Update localStorage after task deletion
}

// Mark Task as Completed
function markComplete(button) {
  const taskItem = button.closest('li');
  taskItem.classList.toggle('completed'); // Toggle the completed class
  button.style.display = 'none'; // Hide the button after task is completed
  saveTasks();
}

// Toggle Completed
function toggleCompleted(event) {
  if (event.target.tagName === 'SPAN') {
    this.classList.toggle('completed');
    saveTasks();
  }
}

// Clear All Tasks
function clearAllTasks() {
  taskList.innerHTML = '';
  saveTasks(); // Remove all tasks from localStorage
}

// Save Tasks to Local Storage
function saveTasks() {
  const tasks = [...taskList.children].map(li => {
    return {
        text: li.firstElementChild.innerText,
        completed: li.classList.contains('completed'),
    }
  });
  console.log('Saving tasks to localStorage:', tasks); // Log tasks being saved
  localStorage.setItem('tasks', JSON.stringify(tasks)); // Save to localStorage
}

// Load Tasks from Local Storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  console.log('Loading tasks from localStorage:', tasks); // Log tasks being loaded
  tasks.forEach(task => {
    const taskItem = createTaskItem(task.text);
    if (task.completed) {
      taskItem.classList.add('completed');
      taskItem.querySelector('.complete-btn').style.display = 'none'; // Hide the "completed" button if task is marked completed
    }
    taskList.appendChild(taskItem);
  });
}

function filterTasks(event) {
  const filter = event.target.dataset.filter;

  filterBtns.forEach(btn => btn.classList.remove('active-filter'));
  event.target.classList.add('active-filter');

  [...taskList.children].forEach(task => {
    switch (filter) {
      case 'all':
        task.style.display = 'flex';
        break;
      case 'active':
        task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
        break;
      case 'completed':
        task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
        break;
    }
  });
}

// Add Task with Enter Key (Fixed: keydown instead of keypress)
taskInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    addTask(); // Enter tuşuna basıldığında addTask fonksiyonunu çalıştır
    event.preventDefault(); // Formun submit olmasını engeller
  }
});
