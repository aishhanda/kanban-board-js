const columns = {
  todo: document.getElementById("todo"),
  progress: document.getElementById("progress"),
  done: document.getElementById("done"),
};

let dragged = null;

function createTask(title, description, columnId = "todo") {
  const task = document.createElement("div");
  task.className = "task";
  task.draggable = true;

  task.innerHTML = `
    <h3>${title}</h3>
    <p>${description}</p>
    <button class="delete">✕</button>
  `;

 
  task.addEventListener("dragstart", () => {
    dragged = task;
  });

 
  task.querySelector(".delete").addEventListener("click", () => {
    task.remove();
    updateCounts();
    saveData();
  });

  columns[columnId].appendChild(task);

  updateCounts();
  saveData();
}

Object.values(columns).forEach((column) => {
  column.addEventListener("dragover", (e) => e.preventDefault());

  column.addEventListener("dragenter", () => {
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("hover-over");
  });

  column.addEventListener("drop", () => {
    column.classList.remove("hover-over");

    if (dragged) {
      column.appendChild(dragged);
      updateCounts();
      saveData();
    }
  });
});

function updateCounts() {
  Object.values(columns).forEach((col) => {
    const count = col.querySelector(".count");
    count.innerText = col.querySelectorAll(".task").length;
  });
}

function saveData() {
  const data = {};

  Object.entries(columns).forEach(([key, col]) => {
    data[key] = Array.from(col.querySelectorAll(".task")).map((task) => ({
      title: task.querySelector("h3").innerText,
      description: task.querySelector("p").innerText,
    }));
  });

  localStorage.setItem("tasks", JSON.stringify(data));
}

function loadData() {
  const data = JSON.parse(localStorage.getItem("tasks"));

  if (!data) return;

  Object.entries(data).forEach(([col, tasks]) => {
    tasks.forEach((t) => {
      createTask(t.title, t.description, col);
    });
  });
}

const modal = document.querySelector(".modal-overlay");
const addBtn = document.querySelector(".add-btn");

addBtn.addEventListener("click", () => {
  modal.classList.add("active");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

const addTaskBtn = document.getElementById("addTask");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("desc");

addTaskBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();

  if (!title) return;

  createTask(title, desc);

  titleInput.value = "";
  descInput.value = "";

  modal.classList.remove("active");
});

loadData();
updateCounts();