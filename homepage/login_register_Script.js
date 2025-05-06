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

            const role = username.toLowerCase() === "admin" ? "admin" : (plan === "Premium" ? "PremiumUser" : "FreemiumUser");

            const userData = {
            username: username,
            password: password,
            role: role,
            age: age
            };

            localStorage.setItem("userData", JSON.stringify(userData));

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

window.addEventListener("DOMContentLoaded", () => {
    const dobInput = document.getElementById("register-date");

    // Calculate max date (3 years ago from today)
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());

    // Format it as yyyy-mm-dd
    const formattedDate = maxDate.toISOString().split("T")[0];

    dobInput.setAttribute("max", formattedDate);
});


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

    const dobInput = document.getElementById("register-date");
    const dob = new Date(dobInput.value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    else if (isNaN(age) || age < 3) {
        message.style.color = "red";
        message.textContent = "You must be at least 3 years old to register.";
    }
    

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
            if (plan === "Freemium") {
                message.style.color = "green";
                message.textContent = "Registered successfully!";
            }
            else {
                message.style.color = "green";
                message.textContent = "Directing to payment page!";
            }

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



