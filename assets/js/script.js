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
    localStorage.setItem('nextId', nextId);
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let $tCard = $("<div>").addClass("card dragTask").attr("id", task.id).css('margin', '5%');
    let $taskCardHeader = $("<h4>").addClass("card-header").text(task.title);
    let $taskCardBody = $("<div>").addClass("card-body").text(task.description);
    let $taskCardDate = $("<div>").addClass("card-footer").text(task.dueDate);
    let $taskCardText = $("<p>").addClass("card-text").text(task.id);
    let $taskCardDelete = $("<a>").addClass("btn btn-danger delete-task").text("Delete Task").attr("data-id", task.id);

    // return class depending on task status, due today, overdue, or upcoming, added class to card for status styling.
    let statusClass = cardDue(task.dueDate);
    $tCard.addClass(statusClass);

    // append elements to task card to create card
    $taskCardBody.append($taskCardText, $taskCardDate, $taskCardDelete);
    // Append remaining elements into the card body
    $tCard.append($taskCardHeader, $taskCardBody);
    // Return the task card
    return $tCard;
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
    for (task in taskList) {
    let card = createTaskCard(task)

        // Append the task card to the appropriate lane
        if (task.status === "to-do") {
            $toDoElement.append(card);
        } else if (task.status === "in-progress") {
            $inProgressElement.append(card);
        } else {
            $doneElement.append(card);
        }
    }

    // Make the cards draggable and create a visual helper for dragging
    $(".dragTask").draggable({
        zIndex: 100,
        opacity: 0.5,
        helper: function(event){
            let originalcard = $(event.target).hasClass('.dragTask') ? $(event.target) : $(event.target).closest('.dragTask');
            return originalcard.clone().css({width: originalcard.outerWidth(),});
        }
    });

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    // Get the values from the form
    let titleE = document.querySelector("#titleInput");
    let dueDate = document.querySelector("#dateInput");
    let description = document.querySelector("#taskInput");

    // New task Id
    generateTaskId();

    // Create a new task object
    let newTask = {
        title: titleE.value,
        date: dueDate.value,
        description: description.value,
        id: nextId,
        status: "to-do"

    };

    // Clear the form
    document.getElementById("form").reset();

    // Add the new task to the task list and push to local storage
    taskList.push(newTask);

    localStorage.setItem('tasks', JSON.stringify(taskList));

    // Render the task list
    renderTaskList();
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    let deleteID = event.target.id;
    let updatedTaskList = Json.parse(localStorage.getItem("tasks"));

    // Filter out the task to delete
    updatedTaskList.foreach((task) => {
    if (task.id === deleteID) {
        taskList.splice(taskList.indexOf(task), 1);
    }
});

    // Update the task list in local storage
    localStorage.setItem("tasks", JSON.stringify(updatedTaskList));

    // Render the task list
    renderTaskList();

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

    // Get the task id and new status
    let taskId = ui.draggable[0].id;
    let newStatus = event.target.id;
    let updateTask = JSON.parse(localStorage.getItem('tasks'));

    // Update the task status
    for (let task of updateTask) {
        if (task.id === taskId) {
            task.status = newStatus;
        }
    }

    // Update the task list in local storage
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // Render the task list
    renderTaskList();
}
// Create a function to return class depending on task status
function cardDue(dueDate) {
    let today = dayjs();
    let taskDate = dayjs(dueDate);

    // generate difference between task date and today
    let difference = today.diff(taskDate, 'd', true);

    if (difference > 1) {
        return "overdue";
    } else if (difference > 0 && difference <= 1) {
        return "due-today";
    } else {
        return "upcoming";
};
}
// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    // add listener to exectue handleAddTask function
    $("#saveTask").on("click", handleAddTask);

    //  add listener to execute handleDeleteTask function
    $(".container").on("click", '.delete-task', handleDeleteTask);

    // add date picker to due date field
    $("#dateInput").datepicker({
        changeMonth: true,
        changeYear: true,
    });

    // make lanes droppable
    $(".lane").droppable({
        aceppt: ".dragTask",
        drop: handleDrop,
    });

    // render the task list
    renderTaskList();

});
