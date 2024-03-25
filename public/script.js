var modal = document.getElementById("login-modal");
var loginLogoutBtn = document.getElementById("login-logout-btn");
var modalClose = document.getElementById("modal-close");

function isLoggedIn() {
  return localStorage.getItem("loggedIn") === "true";
}

function getUserPass() {
  return {
    username: localStorage.getItem("username"),
    password: localStorage.getItem("password"),
  };
}

function removeChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function newCell(text) {
  const cell = document.createElement("td");
  cell.innerText = text;
  return cell;
}

(function init() {
  if (isLoggedIn()) {
    const name = localStorage.getItem("name");
    document.getElementById("nameDisplay").innerText = name;
    document.getElementById("login-logout-btn").innerText = "Logout";
    refreshAccounts();
    refreshRecords();
  }
})();

loginLogoutBtn.onclick = function () {
  console.log("clicked");
  if (isLoggedIn()) {
    localStorage.setItem("loggedIn", false);
    localStorage.removeItem("name");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    document.getElementById("nameDisplay").innerText = "Guest";
    document.getElementById("login-logout-btn").innerText = "Login";
  } else modal.style.display = "block";
};

modalClose.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Show registration form when "Register here" link is clicked
document
  .getElementById("show-registration-form")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("login-form-container").style.display = "none";
    document.getElementById("registration-form-container").style.display =
      "block";
  });

// Show login form when "Login here" link is clicked
document
  .getElementById("show-login-form")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("registration-form-container").style.display =
      "none";
    document.getElementById("login-form-container").style.display = "block";
  });

document
  .getElementById("show-add-account-form")
  .addEventListener("click", function () {
    document.getElementById("add-bank-account").classList.toggle("form-hidden");
  });

document
  .getElementById("show-add-tour-form")
  .addEventListener("click", function () {
    document.getElementById("add-tour").classList.toggle("form-hidden");
  });

document
  .getElementById("show-add-product-form")
  .addEventListener("click", function () {
    document.getElementById("add-product").classList.toggle("form-hidden");
  });

document
  .getElementById("show-add-spending-form")
  .addEventListener("click", function () {
    document.getElementById("add-spending").classList.toggle("form-hidden");
  });

async function register() {
  const form = document.getElementById("registration-form");
  const name = form.name.value;
  const username = form["reg-username"].value;
  const password = form["reg-password"].value;
  const json = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, username, password }),
  }).then((res) => res.json());
  if (json.success) {
    localStorage.setItem("username", username);
    localStorage.setItem("name", name);
    localStorage.setItem("password", password);
    localStorage.setItem("loggedIn", true);
    document.getElementById("nameDisplay").innerText = name;
    document.getElementById("login-logout-btn").innerText = "Logout";
    modal.style.display = "none";
  }
}

async function login() {
  const form = document.getElementById("login-form");
  const username = form["username"].value;
  const password = form["password"].value;
  const json = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  }).then((res) => res.json());
  if (json.success) {
    const name = json.results[0].name;
    localStorage.setItem("name", name);
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    localStorage.setItem("loggedIn", true);
    document.getElementById("nameDisplay").innerText = name;
    document.getElementById("login-logout-btn").innerText = "Logout";
    modal.style.display = "none";
  }
}

async function refreshAccounts() {
  if (!isLoggedIn()) return;

  const accountsTable = document.getElementById("accounts-table");

  const { username, password } = getUserPass();
  const json = await fetch("/api/accounts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then((res) => res.json());

  const accounts = json.results;
  if (!accounts.length) {
    accountsTable.classList.add("form-hidden");
    return;
  }

  accountsTable.classList.remove("form-hidden");
  const tbody = accountsTable.querySelector("tbody");
  removeChildren(tbody);
  accounts.forEach(({ name, balance }) => {
    const row = document.createElement("tr");
    row.appendChild(newCell(name));
    row.appendChild(newCell(balance));
    tbody.appendChild(row);
  });
}

async function addAccount() {
  if (!isLoggedIn()) {
    alert("You must be logged in to add an account");
    return;
  }

  const form = document.getElementById("add-account-form");
  const name = form["add-account-name"].value;
  const balance = form["initial-balance"].value;

  const { username, password } = getUserPass();
  const json = await fetch("/api/addAccount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      account: {
        name,
        balance,
      },
    }),
  }).then((res) => res.json());

  if (json.success) {
    refreshAccounts();
  }
}

async function refreshRecords() {
  if (!isLoggedIn()) return;

  const recordsTable = document.getElementById("records-table");

  const { username, password } = getUserPass();
  const json = await fetch("/api/records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then((res) => res.json());

  const records = json.results;
  if (!records.length) {
    recordsTable.classList.add("form-hidden");
    return;
  }

  recordsTable.classList.remove("form-hidden");
  const tbody = recordsTable.querySelector("tbody");
  removeChildren(tbody);
  records.forEach(({ id, name, createdAt }) => {
    const row = document.createElement("tr");
    row.appendChild(newCell(name));
    row.appendChild(newCell(new Date(createdAt).toLocaleTimeString()));
    cell = newCell("expand");
    cell.style.color = "blue";
    cell.style.textDecoration = "underline";
    cell.style.cursor = "pointer";
    cell.onclick = function () {
      showRecordDetails(id);
    };
    row.appendChild(cell);
    tbody.appendChild(row);
  });
}

async function addRecord() {
  if (!isLoggedIn()) {
    alert("You must be logged in to add an account");
    return;
  }

  const form = document.getElementById("tour-form");
  const name = form["tour-name"].value;
  const description = form["tour-description"].value;

  const { username, password } = getUserPass();
  const json = await fetch("/api/addRecord", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      record: {
        name,
        description,
      }
    }),
  }).then((res) => res.json());

  if (json.success) {
    refreshRecords();
  }
}
