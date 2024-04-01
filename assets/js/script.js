// Retrieve tasks and nextId from localStorage - assigned empty array for tasks and 0 for nextId if no data is found
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 0;

// Generate elments for each task stage, To Do, In Progress, and Done
let $toDoElement = $("#todo-cards").addClass('.lane').attr('background-color', 'gray');
let $inProgressElement = $("#in-progress-cards").addClass('.lane');
let $doneElement = $("#done-cards").addClass('.lane');

// Todo: create a function to generate a unique task id - increment nextId and save to localStorage
function generateTaskId() {
    // nextId = nextId + 1; = assigned nextID to 0 with or operator above
    nextId++;
    localStorage.setItem("nextId", nextId);
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let $taskCard = $("<div>").addClass("card dragTask").attr("id", task.id).css('margin', '5%');
    let $taskCardHeader = $("<h4>").addClass("card-header").text(task.title);
    let $taskCardBody = $("<div>").addClass("card-body").text(task.description);
    let $taskCardDate = $("<div>").addClass("card-footer").text(task.dueDate);
    let $taskCardText = $("<p>").addClass("card-text").text(task.id);
    let $taskCardDelete = $("<a>").addClass("btn btn-danger delete-task").text("Delete Task").attr("data-id", task.id);

    // return class depending on task status, due today, overdue, or upcoming, added class to card for status styling.
    let statusClass = cardDue(task.dueDate);
    $taskCard.addClass(statusClass);

    // append elements to task card to create card
    $taskCardBody.append($taskCardText, $taskCardDate, $taskCardDelete);
    // Append remaining elements into the card body
    $taskCard.append($taskCardHeader, $taskCardBody);
    // Return the task card
    return $taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    //Tasks from local storage
    taskList = JSON.parse(localStorage.getItem("tasks")) || [];

    // Clear the task list
    $toDoElement.empty();
    $inProgressElement.empty();
    $doneElement.empty();

    // Loop through the task list and append each task to the appropriate lane
    for (let i = 0; i < taskList.length; i++) {
        let task = taskList[i];
        let $taskCard = createTaskCard(task);

        // Append the task card to the appropriate lane
        if (task.status === "To Do") {
            $toDoElement.append($taskCard);
        } else if (task.status === "In Progress") {
            $inProgressElement.append($taskCard);
        } else {
            $doneElement.append($taskCard);
        }
    }

    // Make the cards draggable and create a visual helper for dragging
    $(".dragTask").draggable({
        helper: function(event){
            let clone = $(event.target).hasClass('.dragTask') ? $(event.target) : $(event.target).closest('.dragTask');
            return clone.clone().css('width', '200px');
        }
    });

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    // Get the values from the form
    let title = $("#title").val().trim();
    let description = $("#description").val().trim();
    let dueDate = $("#due-date").val();
    let status = "To Do";


    // New task Id
    generateTaskId();

    // Create a new task object
    let newTask = {
        id: nextId,
        title: title,
        description: description,
        dueDate: dueDate,
        status: status
    };

    // Clear the form
    document.getElementById("task-form").reset();

    // Add the new task to the task list and push to local storage
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // Render the task list
    renderTaskList();
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
