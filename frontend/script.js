const API = "http://localhost:2020/tasks";

let currentView = "pending";
let currentPriority = null;
let taskIdToDelete = null;

async function fetchTasks() {
    const res = await fetch(API);
    const tasks = await res.json();
    displayTasks(tasks);
}

async function addTask() {
    const title = document.getElementById("title").value;
    const priority = document.getElementById("priority").value;

    try {
        const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, priority })
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.error, "error");  // show backend error
            return;
        }

        showToast("Task added successfully !", "success");

        document.getElementById("title").value = "";
        document.getElementById("priority").value = "";

        fetchTasks();

    } catch (error) {
        alert("Server not reachable");
    }
}


async function toggleTask(id) {
    try {
        const res = await fetch(`${API}/${id}`, { method: "PUT" });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.error, "error");
            return;
        }

        showToast("Task updated !", "success");
        fetchTasks();

    } catch (error) {
        alert("Server error");
    }
}

function openDeleteModal(id) {
    taskIdToDelete = id;

    const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
    modal.show();
}

async function deleteTask() {
    if (!taskIdToDelete) return;

    try {
        const res = await fetch(`${API}/${taskIdToDelete}`, {
            method: "DELETE"
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.error, "error");
            return;
        }

        showToast("Task deleted 🗑", "warning");

        taskIdToDelete = null;

        const modalElement = document.getElementById("deleteModal");
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        fetchTasks();

    } catch (error) {
        showToast("Server error", "error");
    }
}

/* ===================== */
/* VIEW CONTROLS */
/* ===================== */

function showPending() {
    currentView = "pending";
    currentPriority = null;

    document.getElementById("priorityFilter").style.display = "block";

    setActiveMainButton("pending");
    clearPriorityActive();

    fetchTasks();
}   

function showCompleted() {
    currentView = "completed";
    currentPriority = null;

    document.getElementById("priorityFilter").style.display = "none";

    setActiveMainButton("completed");
    clearPriorityActive();

    fetchTasks();
}

function filterByPriority(priority) {
    currentPriority = priority;

    setActivePriorityButton(priority);

    fetchTasks();
}

/* ===================== */
/* ACTIVE BUTTON LOGIC */
/* ===================== */

function setActiveMainButton(type) {
    const pendingBtn = document.getElementById("pendingBtn");
    const completedBtn = document.getElementById("completedBtn");

    pendingBtn.classList.remove("active");
    completedBtn.classList.remove("active");

    if (type === "pending") pendingBtn.classList.add("active");
    if (type === "completed") completedBtn.classList.add("active");
}   

function setActivePriorityButton(priority) {
    clearPriorityActive();

    if (priority === "Low") document.getElementById("lowBtn").classList.add("active");
    if (priority === "Medium") document.getElementById("mediumBtn").classList.add("active");
    if (priority === "High") document.getElementById("highBtn").classList.add("active");
}

function clearPriorityActive() {
    document.getElementById("lowBtn").classList.remove("active");
    document.getElementById("mediumBtn").classList.remove("active");
    document.getElementById("highBtn").classList.remove("active");
}

/* ===================== */
/* DISPLAY LOGIC */
/* ===================== */

function displayTasks(tasks) {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    let filtered = [];

    if (currentView === "pending") {
        filtered = tasks.filter(t => !t.completed);

        if (currentPriority) {
            filtered = filtered.filter(t => t.priority === currentPriority);
        }
    }

    if (currentView === "completed") {
        filtered = tasks.filter(t => t.completed);
    }

    filtered.forEach(task => {

        // 🔥 Badge color based on priority
        let priorityColor = "";

        if (task.priority === "Low") priorityColor = "text-primary border-primary";
        if (task.priority === "Medium") priorityColor = "text-secondary border-secondary";
        if (task.priority === "High") priorityColor = "text-danger border-danger";

        list.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-2">
                    <strong>${task.title}</strong>

                    <span class="badge rounded-pill border ${priorityColor} px-3 py-1">
                        ${task.priority}
                    </span>

                    ${
                        task.completed 
                        ? '<span class="badge rounded-pill bg-success-subtle text-success px-3 py-1">Completed</span>'
                        : ''
                    }
                </div>

                <div>
                    ${!task.completed 
                        ? `<button onclick="toggleTask(${task.id})" class="btn btn-sm btn-outline-success">✔</button>` 
                        : ''}
                    <button onclick="openDeleteModal(${task.id})" class="btn btn-sm btn-outline-danger">🗑</button>
                </div>
            </li>
        `;
    });

    updateSummary(tasks);
}

function updateSummary(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    document.getElementById("summary").innerHTML =
        `Total: ${total} | Completed: ${completed} | Pending: ${pending}`;
}

function showToast(message, type = "success") {
    const toastElement = document.getElementById("appToast");
    const toastMessage = document.getElementById("toastMessage");

    toastMessage.textContent = message;

    // Remove old background classes
    toastElement.classList.remove("bg-success", "bg-danger", "bg-warning");

    if (type === "success") toastElement.classList.add("bg-success");
    if (type === "error") toastElement.classList.add("bg-danger");
    if (type === "warning") toastElement.classList.add("bg-secondary");

    const toast = new bootstrap.Toast(toastElement, {
        delay: 2000,   
        autohide: true  
    });
    toast.show();
}


/* ===================== */
/* DEFAULT LOAD */
/* ===================== */

window.onload = function () {
    showPending();

    document.getElementById("confirmDeleteBtn")
        .addEventListener("click", deleteTask);
};

