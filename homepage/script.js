// Login function
function login() {
    let username = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;

    if (username && password) {
        alert("Login Successful!");
       // window.location.href = "main.html"; // Redirect to main page
    } 
    else {
        alert("Please enter valid credentials.");
    }
}

// Register function
function register() {
    let username = document.getElementById("register-username").value;
    let password = document.getElementById("register-password").value;
    let confirmPassword = document.getElementById("confirm-password").value;

    if (username && password && confirmPassword) {
        if (password === confirmPassword) {
            alert("Registration Successful!");
           // window.location.href = "main.html"; // Redirect to main page
        } 
        else {
            alert("Passwords do not match!");
        }
    } 
    else {
        alert("Please fill all fields.");
    }
}
