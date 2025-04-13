/**
 * Initializes summary page by calling all display functions
 */
function initSum() {
  displayInfo();
  getGreeting();
  countTasks();
  countUrgentTasks();
  countToDoTasks();
  countDone();
  countProgress();
  countAwait();
  getClosestDueDate();
}

/**
 * Displays user information in header
 */
function displayInfo() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.name && user.name !== "Guest") {
    document.getElementById("renderName-1").innerText = user.name;
    document.getElementById("renderName-2").innerText = user.name;
  } else {
    document.getElementById("renderName-1").innerText = "";
    document.getElementById("renderName-2").innerText = "";
  }
}

/**
 * Displays time-based greeting message
 */
function getGreeting() {
  const hour = new Date().getHours();
  let message;

  if (hour < 12) {
    message = "Good morning";
  } else if (hour < 18) {
    message = "Nice to see you";
  } else {
    message = "Good evening";
  }

  document.getElementById("greeting-1").innerText = message;
  document.getElementById("greeting-2").innerText = message;
}

/**
 * Counts and displays total number of tasks
 * @async
 */
async function countTasks() {
  const url =
    "https://join-ma-default-rtdb.europe-west1.firebasedatabase.app/tasks.json";
  try {
    const response = await fetch(url);
    const data = await response.json();
    const taskCount = data ? Object.keys(data).length : 0;
    document.getElementById("totalTasks").innerText = `${taskCount}`;
  } catch (error) {
    document.getElementById("totalTasks").innerText = "-";
  }
}

/**
 * Counts and displays number of urgent tasks
 * @async
 */
async function countUrgentTasks() {
  const url =
    "https://join-ma-default-rtdb.europe-west1.firebasedatabase.app/tasks.json";
  try {
    const response = await fetch(url);
    const data = await response.json();
    let urgentCount = 0;

    if (data) {
      urgentCount = Object.values(data).filter(
        (task) => task.priority.priorityText === "Urgent"
      ).length;
    }

    document.getElementById("urgentTasks").innerText = `${urgentCount}`;
  } catch (error) {
    document.getElementById("urgentTasks").innerText = "-";
  }
}

/**
 * Counts and displays number of tasks in 'To do' category
 * @async
 */
async function countToDoTasks() {
  const url =
    "https://join-ma-default-rtdb.europe-west1.firebasedatabase.app/tasks.json";
  try {
    const response = await fetch(url);
    const data = await response.json();
    let todoCount = 0;

    if (data) {
      todoCount = Object.values(data).filter(
        (task) => task.mainCategory === "To do"
      ).length;
    }

    document.getElementById("render-todo").innerText = `${todoCount}`;
  } catch (error) {
    document.getElementById("render-todo").innerText = "-";
  }
}

/**
 * Counts and displays number of tasks in 'Done' category
 * @async
 */
async function countDone() {
  const url =
    "https://join-ma-default-rtdb.europe-west1.firebasedatabase.app/tasks.json";
  try {
    const response = await fetch(url);
    const data = await response.json();
    let doneCount = 0;

    if (data) {
      doneCount = Object.values(data).filter(
        (task) => task.mainCategory === "Done"
      ).length;
    }

    document.getElementById("render-done").innerText = `${doneCount}`;
  } catch (error) {
    document.getElementById("render-done").innerText = "-";
  }
}

/**
 * Counts and displays number of tasks in 'In progress' category
 * @async
 */
async function countProgress() {
  const url =
    "https://join-ma-default-rtdb.europe-west1.firebasedatabase.app/tasks.json";
  try {
    const response = await fetch(url);
    const data = await response.json();
    let progressCount = 0;

    if (data) {
      progressCount = Object.values(data).filter(
        (task) => task.mainCategory === "In progress"
      ).length;
    }

    document.getElementById("render-progress").innerText = `${progressCount}`;
  } catch (error) {
    document.getElementById("render-progress").innerText = "-";
  }
}

/**
 * Counts and displays number of tasks in 'Await feedback' category
 * @async
 */
async function countAwait() {
  const url =
    "https://join-ma-default-rtdb.europe-west1.firebasedatabase.app/tasks.json";
  try {
    const response = await fetch(url);
    const data = await response.json();
    let awaitCount = 0;

    if (data) {
      awaitCount = Object.values(data).filter(
        (task) => task.mainCategory === "Await feedback"
      ).length;
    }

    document.getElementById("render-await").innerText = `${awaitCount}`;
  } catch (error) {
    document.getElementById("render-await").innerText = "-";
  }
}

/**
 * Parses Firebase date string into Date object
 * @param {string} firebaseDate - Date string in "dd/mm/yyyy" format
 * @returns {Date} Parsed Date object
 */
function parseFirebaseDate(firebaseDate) {
  const parts = firebaseDate.split("/");
  return new Date(parts[2], parts[1] - 1, parts[0]);
}

/**
 * Finds and displays closest upcoming due date from tasks
 * @async
 */
async function getClosestDueDate() {
  const url =
    "https://join-ma-default-rtdb.europe-west1.firebasedatabase.app/tasks.json";
  try {
    const response = await fetch(url);
    const data = await response.json();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let closestDate = null;

    if (data) {
      Object.values(data).forEach((task) => {
        if (task.dueDate) {
          const taskDate = parseFirebaseDate(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);

          if (taskDate >= today) {
            if (!closestDate || taskDate < closestDate) {
              closestDate = taskDate;
            }
          }
        }
      });
    }

    const options = { day: "2-digit", month: "long", year: "numeric" };
    const formattedDate = closestDate
      ? closestDate
        .toLocaleDateString("en-GB", options)
        .replace(/ (\d{4})$/, ", $1")
      : "-";
    document.getElementById("render-due-date").innerText = formattedDate;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    document.getElementById("render-due-date").innerText = "-";
  }
}
