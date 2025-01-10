$(document).ready(function () {
    // Fetch tasks on page load
    fetchTasks();

    // Create Task
    $('#createTaskForm').submit(function (event) {
        event.preventDefault();

        const taskData = {
            name: $('#taskName').val(),
            schedule_time: $('#scheduleTime').val(),
        };
console.log(taskData);

        $.ajax({
            url: 'http://localhost:3000/cms/tasks',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(taskData),
            success: function (response) {
                alert('Task created successfully!');
                fetchTasks(); // Refresh task list
            }
        });
    });

    // Update Task
    $('#updateForm').submit(function (event) {
        event.preventDefault();

        const taskData = {
            id: $('#updateTaskId').val(),
            name: $('#updateTaskName').val(),
            schedule_time: $('#updateScheduleTime').val(),
            payload: $('#updatePayload').val()
        };

        $.ajax({
            url: 'http://localhost:3000/cms/tasks/' + taskData.id,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(taskData),
            success: function (response) {
                alert('Task updated successfully!');
                fetchTasks(); // Refresh task list
                $('#updateTaskForm').hide(); // Hide update form
            }
        });
    });
});

// Fetch all tasks
function fetchTasks() {
    $.get('/tasks', function (tasks) {
        let taskTableContent = '';
        tasks.forEach(function (task) {
            taskTableContent += `<tr>
                <td>${task.name}</td>
                <td>${task.schedule_time}</td>
                <td>${task.status}</td>
                <td>
                    <button onclick="editTask(${task.id})">Edit</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                    <button onclick="viewTask(${task.id})">View Details</button>
                </td>
            </tr>`;
        });
        $('#taskTable tbody').html(taskTableContent);
    });
}

// Edit Task
function editTask(taskId) {
    $.get('/tasks/' + taskId, function (task) {
        $('#updateTaskId').val(task.id);
        $('#updateTaskName').val(task.name);
        $('#updateScheduleTime').val(task.schedule_time);
        $('#updatePayload').val(task.payload);
        $('#updateTaskForm').show();
    });
}

// Delete Task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        $.ajax({
            url: 'http://localhost:3000/cms/tasks/' + taskId,
            method: 'DELETE',
            success: function (response) {
                alert('Task deleted successfully!');
                fetchTasks(); // Refresh task list
            }
        });
    }
}

// View Task Details
function viewTask(taskId) {
    $.get('/tasks/' + taskId, function (task) {
        alert('Task Details:\n' +
            'Name: ' + task.name + '\n' +
            'Schedule Time: ' + task.schedule_time + '\n' +
            'Payload: ' + JSON.stringify(task.payload, null, 2) + '\n' +
            'Status: ' + task.status);
    });
}
