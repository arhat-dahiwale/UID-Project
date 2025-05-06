// Predefined credentials
const predefinedUsers = {
    "FreemiumUser": { email: "freemium@example.com", password: "Freemium@123", role: "FreemiumUser", age: 18 },
    "PremiumUser": { email: "premium@example.com", password: "Premium@123", role: "PremiumUser", age: 20 },
    "Admin": { email: "admin@example.com", password: "Admin@123", role: "Admin", age: 25 }
};

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
        if (!predefinedUsers[username]) {
            message.style.color = "red";
            message.textContent = "Username not found.";
        } 
        else if (!usernameRegex.test(username)) {
            message.style.color = "red";
            message.textContent = "Please enter valid username credential.";
        }
        else if (predefinedUsers[username].email !== email) {
            message.style.color = "red";
            message.textContent = "Email doesn't match the username.";
        }
        else if (!emailRegex.test(email)) {
            message.textContent = "Please enter valid email credential.";
        }
        else if (predefinedUsers[username].password !== password) {
            message.style.color = "red";
            message.textContent = "Incorrect password.";
        }
        else if (!passwordRegex.test(password)) {
            message.style.color = "red";
            message.textContent = "Please enter valid password credential.";
        }
        else {
            message.style.color = "green";
            message.textContent = "Login successful !";

            const userData = {
                username: username,
                password: password,
                role: predefinedUsers[username].role,
                age: predefinedUsers[username].age
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
    // Calculate min date (70 years ago from today)
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
    const minDate = new Date(today.getFullYear() - 70, today.getMonth(), today.getDate());


    // Format it as yyyy-mm-dd
    const formattedDate = maxDate.toISOString().split("T")[0];
    const formattedMinDate = minDate.toISOString().split("T")[0];


    dobInput.setAttribute("max", formattedDate);
    dobInput.setAttribute("min", formattedMinDate);

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
    else if (isNaN(age) || age < 3 || age > 70) {
        message.style.color = "red";
        message.textContent = "Your age must be between 3 and 70 years to register.";
        return;
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



