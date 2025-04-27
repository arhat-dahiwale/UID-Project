// Login function
function login(event) {
    event.preventDefault();
    const usernameInput = document.getElementById("login-username");
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const message = document.getElementById("toggleText");

    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex

    let isValid = true; // flag

    if (username && email && password) {
        if (!emailRegex.test(email)) {
            message.textContent = "Please check the email credentials.";
        }
        else {
            message.style.color = "green";
            message.textContent = "Login successful !";
            setTimeout(function() {
                window.location.href = "main.html"; // redirect after delay
            }, 1500); 
            usernameInput.value = "";
            emailInput.value = "";
            passwordInput.value = "";
        }
    } 
    else {
        message.textContent = "Please fill in all fields.";
    }
    
}

// Register function
function register(event) {
    event.preventDefault();
    const usernameInput = document.getElementById("register-username");
    const emailInput = document.getElementById("register-email");
    const passwordInput = document.getElementById("register-password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const message = document.getElementById("toggleText");

    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex

    if (username && email && password && confirmPassword) {
        if (password !== confirmPassword) {
            message.style.color = "red";
            message.textContent = "Passwords do not match!";
        }
        else if (!emailRegex.test(email)) {
            message.style.color = "red";
            message.textContent = "Please check the email credentials.";
        }
        else {
            message.style.color = "green";
            message.textContent = "Registered successfully!";
            setTimeout(function() {
                window.location.href = "main.html"; // redirect after delay
            }, 1500);
            usernameInput.value = "";
            emailInput.value = "";
            passwordInput.value = "";
            confirmPasswordInput.value = "";
        }
    } 
    else {
        message.style.color = "red";
        message.textContent = "Please fill in all fields.";
    }
}
