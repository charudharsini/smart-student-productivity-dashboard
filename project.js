/* ==============================
SMART PRODUCTIVITY DASHBOARD (ADVANCED)
============================== */

/* ===== LOCAL STORAGE ===== */
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let productivityList = JSON.parse(localStorage.getItem("productivity")) || [];
let motivationList = JSON.parse(localStorage.getItem("motivation")) || [];

/* ===== SAVE FUNCTION ===== */
function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("productivity", JSON.stringify(productivityList));
    localStorage.setItem("motivation", JSON.stringify(motivationList));
}

/* ==============================
TASK MANAGER (ADVANCED)
============================== */
function renderTasks() {
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    let completed = 0;

    tasks.forEach((task, index) => {
        let li = document.createElement("li");

        li.innerHTML = `
            <span style="${task.done ? 'text-decoration:line-through;' : ''}">
                ${task.text} (${task.category})
            </span>
            <div>
                <button onclick="toggleTask(${index})">✔</button>
                <button onclick="deleteTask(${index})">❌</button>
            </div>
        `;

        if (task.done) completed++;

        list.appendChild(li);
    });

    updateProgress(completed);
    saveData();
}

function addItem(inputId, listId) {
    let input = document.getElementById(inputId);
    let value = input.value.trim();

    if (!value) {
        alert("⚠ Enter something!");
        return;
    }

    // TASK SECTION
    if (listId === "taskList") {
        let category = prompt("Enter category (Study / Work / Personal):", "Study");

        if (category === null || category.trim() === "") {
            category = "General";
        }

        tasks.push({
            text: value,
            category: category,
            done: false
        });
        alert("✅ Task Added Successfully!")

        input.value = "";
        renderTasks();
    }

    // PRODUCTIVITY SECTION
    else if (listId === "productivityList") {
        productivityList.push(value);
        input.value = "";
        renderSimpleList(productivityList, listId);
    }

    // MOTIVATION SECTION
    else if (listId === "motivationList") {
        motivationList.push(value);
        input.value = "";
        renderSimpleList(motivationList, listId);
    }

    saveData();
}

/* ===== TOGGLE TASK ===== */
function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    renderTasks();
}
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

/* ===== DELETE TASK ===== */
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

/* ===== PROGRESS BAR ===== */
function updateProgress(completed) {
    let total = tasks.length;
    let percent = total ? Math.round((completed / total) * 100) : 0;

    document.getElementById("progressBar").style.width = percent + "%";

    document.getElementById("timerDisplay").innerText =
        percent + "% Done 🎯";
}

/* ==============================
SIMPLE LIST RENDER
============================== */
function renderSimpleList(arr, id) {
    let list = document.getElementById(id);
    list.innerHTML = "";

    arr.forEach((item, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            ${item}
            <button onclick="removeSimple(${index}, '${id}')">❌</button>
        `;
        list.appendChild(li);
    });

    saveData();
}

function removeSimple(index, id) {
    if (id === "productivityList") {
        productivityList.splice(index, 1);
        renderSimpleList(productivityList, id);
    } else {
        motivationList.splice(index, 1);
        renderSimpleList(motivationList, id);
    }
}

/* ==============================
POMODORO TIMER (SMART VERSION)
============================== */
let time = 1500;
let timer;
let isRunning = false;

function startTimer() {
    if (isRunning) return;

    isRunning = true;

    timer = setInterval(() => {
        if (time <= 0) {
            clearInterval(timer);
            alert("🎉 Session Completed! Take a break!");
            time = 300; // auto break (5 min)
            isRunning = false;
            updateDisplay();
            return;
        }

        time--;
        updateDisplay();
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    time = 1500;
    isRunning = false;
    updateDisplay();
}

function updateDisplay() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    document.getElementById("timerDisplay").innerText =
        `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

/* ==============================
MOTIVATION AUTO ROTATE
============================== */
let defaultQuotes = [
    "Push yourself, because no one else will!",
    "Success is built daily 💪",
    "Stay focused. Stay strong.",
    "Dream big. Work hard."
];

function autoMotivation() {
    let box = document.getElementById("motivationList");

    setInterval(() => {
        let random = Math.floor(Math.random() * defaultQuotes.length);
        box.innerHTML = `<li>${defaultQuotes[random]}</li>`;
    }, 5000);
}

/* ==============================
INITIAL LOAD
============================== */
window.onload = function () {
    renderTasks();
    renderSimpleList(productivityList, "productivityList");
    renderSimpleList(motivationList, "motivationList");
    updateDisplay();
    autoMotivation();
};
let chart;

function renderChart() {
    let ctx = document.getElementById("chart").getContext("2d");

    let completed = tasks.filter(t => t.done).length;
    let pending = tasks.length - completed;

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Completed", "Pending"],
            datasets: [{
                data: [completed, pending],
                backgroundColor: ["#10b981", "#ef4444"]
            }]
        }
    });
}