var modal = document.getElementById("login-modal");
var loginLogoutBtn = document.getElementById("login-logout-btn");
var modalClose = document.getElementById("modal-close");

(function init() {
  const loggedIn = localStorage.getItem("loggedIn");
  console.log(loggedIn);
  if (loggedIn === "true") {
    const name = localStorage.getItem("name");
    document.getElementById("nameDisplay").innerText = name;
    document.getElementById("login-logout-btn").innerText = "Logout";
  }
})();

loginLogoutBtn.onclick = function () {
  const loggedIn = localStorage.getItem("loggedIn");
  if (loggedIn === "true") {
    localStorage.setItem("loggedIn", false);
    localStorage.removeItem("name");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    document.getElementById("nameDisplay").innerText = "Guest";
    document.getElementById("login-logout-btn").innerText = "Login";
  }
  else modal.style.display = "block";
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
  .getElementById("show-adds-account-form")
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
document
  .getElementById("show-add-account-form")
  .addEventListener("click", function () {
    document.getElementById("add-bank-account").classList.toggle("form-hidden");
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
