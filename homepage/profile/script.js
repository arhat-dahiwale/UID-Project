
function openModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
  }
  
  
  function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
  }
  

  function handleSave(event, inputId, messageId) {
    event.preventDefault();
    const input = document.getElementById(inputId);
    const message = document.getElementById(messageId);
    
    if (input.value.trim() === "") {
      message.textContent = "This field cannot be empty.";
      message.style.color = "red";
      return false;
    }

    message.textContent = "Saved successfully!";
    message.style.color = "green";
    closeModal(inputId + "Modal");
    return true;
  }
  
  function handlePasswordSave(event) {
    event.preventDefault();
  
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordMessage = document.getElementById('passwordMessage');
  
    if (newPassword.value !== confirmPassword.value) {
      passwordMessage.textContent = "Passwords do not match.";
      passwordMessage.style.color = "red";
      return false;
    }
  
 
    passwordMessage.textContent = "Password changed successfully!";
    passwordMessage.style.color = "green";
    closeModal('passwordModal');
    return true;
  }
  
  document.querySelectorAll('.edit-link').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const section = e.target.closest('.form-group');
      const labelText = section.querySelector('label').textContent;
      
      if (labelText === "Username") {
        openModal('nameModal');
      } else if (labelText === "Email") {
        openModal('emailModal');
      } else if (labelText === "Primary phone number") {
        openModal('phoneModal');
      }
    });
  });
  