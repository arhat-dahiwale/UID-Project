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

    const usernameRegex = /^[a-zA-Z0-9_ ]{3,15}$/; // Allows letters, numbers, underscores, and spaces
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    if (username && email && password) {
        if (!usernameRegex.test(username)) {
            message.style.color = "red";
            message.textContent = "Please enter valid username credential.";
        }
        else if (!emailRegex.test(email)) {
            message.textContent = "Please enter valid email credential.";
        }
        else if (!passwordRegex.test(password)) {
            message.style.color = "red";
            message.textContent = "Please enter valid password credential.";
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
    const planInput = document.getElementById("register-plan");
    const message = document.getElementById("toggleText");

    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const plan = planInput.value;


    const usernameRegex = /^[a-zA-Z0-9_ ]{3,15}$/; // Allows letters, numbers, underscores, and spaces
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    


    if (username && email && password && confirmPassword && plan) {
        if (password !== confirmPassword) {
            message.style.color = "red";
            message.textContent = "Passwords do not match!";
        }
        else if (!usernameRegex.test(username)) {
            message.style.color = "red";
            message.textContent = "Please enter valid username credential.";
        }
        else if (!emailRegex.test(email)) {
            message.style.color = "red";
            message.textContent = "Please enter valid email credential.";
        }
        else if (!passwordRegex.test(password)) {
            message.style.color = "red";
            message.textContent = "Please enter valid password credential.";
        }
        else if (plan !== "Freemium" && plan !== "Premium") {
            message.style.color = "red";
            message.textContent = "Please select a valid plan.";
        }
        else {
            message.style.color = "green";
            message.textContent = "Registered successfully!";
            const redirectURL = plan === "Premium" ? "payment.html" : "main.html";
            setTimeout(function() {
                window.location.href = redirectURL; // redirect after delay
            }, 1500);
            usernameInput.value = "";
            emailInput.value = "";
            passwordInput.value = "";
            confirmPasswordInput.value = "";
            planInput.value = "";
        }
    } 
    else {
        message.style.color = "red";
        message.textContent = "Please fill in all fields.";
    }
}



