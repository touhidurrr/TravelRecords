var modal = document.getElementById("login-modal");
var btn = document.getElementById("login-logout-btn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  modal.style.display = "block";
};

span.onclick = function () {
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

// Example registration function (simplified)
document
  .getElementById("registration-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    // Dummy validation
    var name = document.getElementById("name").value;
    var regUsername = document.getElementById("reg-username").value;
    var regPassword = document.getElementById("reg-password").value;
    // Dummy registration logic (here, just alerting the input values)
    alert(
      "Registration Successful\nName: " +
        name +
        "\nUsername: " +
        regUsername +
        "\nPassword: " +
        regPassword
    );
  });

// Example login function (simplified)
document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    // Dummy validation
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username === "user" && password === "pass") {
      alert("Login Successful");
      modal.style.display = "none";
      btn.textContent = "Logout";
    } else {
      alert("Login Failed: Incorrect username or password");
    }
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
