document.addEventListener('DOMContentLoaded', function() {
    // Payment method tabs
    const methodTabs = document.querySelectorAll('.method-tab');
    const methodContents = document.querySelectorAll('.method-content');
    
    methodTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            methodTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all method contents
            methodContents.forEach(content => content.style.display = 'none');
            // Show selected method content
            const method = this.getAttribute('data-method');
            document.getElementById(`${method}-method`).style.display = 'block';
        });
    });

    // UPI options (ID vs QR)
    const upiOptions = document.querySelectorAll('.upi-option');
    const upiIdGroup = document.querySelector('.upi-id-group');
    const qrGroup = document.querySelector('.qr-group');
    
    upiOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            upiOptions.forEach(opt => opt.classList.remove('selected'));
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Show the appropriate section
            const selectedOption = this.getAttribute('data-option');
            if (selectedOption === 'id') {
                upiIdGroup.style.display = 'block';
                qrGroup.style.display = 'none';
            } else {
                upiIdGroup.style.display = 'none';
                qrGroup.style.display = 'block';
                generateQRCode(); // 👈 Generate QR when shown
            }
        });
    });

    function generateQRCode() {
        const qrContainer = document.getElementById('qrcode');
        qrContainer.innerHTML = ''; // clear previous QR
    
        const upiLink = "upi://pay?pa=yourupi@bank&pn=CineSphere&am=649&cu=INR"; // Replace with actual UPI ID
    
        new QRCode(qrContainer, {
            text: upiLink,
            width: 180,
            height: 180,
            correctLevel: QRCode.CorrectLevel.H
        });
    }
    

    // UPI form submission
    const upiForm = document.getElementById('upiForm');
    const message = document.getElementById('upi-message'); // Add a div with this ID to your HTML

    
    upiForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate UPI ID if that option is selected
        const upiOption = document.querySelector('.upi-option.selected').getAttribute('data-option');
        
        if (upiOption === 'id') {
            const upiId = document.getElementById('upiId').value.trim();
    
            if (upiId === "") {
                message.style.color = 'red';
                message.textContent = 'Please enter UPI ID (e.g. name@upi)';
            } else if (!validateUpiId(upiId)) {
                message.style.color = 'red';
                message.textContent = 'Please enter a valid UPI ID (e.g. name@upi)';
            } else {
                message.style.color = 'green';
                message.textContent = `Initiating UPI payment request for ${upiId}...`;
                
                sessionStorage.setItem("userUpiData", JSON.stringify({ upiId })); // store UPI ID in sessionStorage

                // Store the UPI ID in localStorage for main.html access
                let user = JSON.parse(localStorage.getItem('user'));  // Get existing user data from localStorage
                user.upiID = upiId;  // Add the UPI ID
                localStorage.setItem('user', JSON.stringify(user));  // Save updated user object back to localStorage

                setTimeout(() => {
                    window.location.href = "confirmation.html";
                }, 1500);
            }
    
        } else {
            // QR code payment flow
            message.style.color = 'green';
            message.textContent = 'Please scan the QR code with your UPI app to complete payment';
            
            sessionStorage.setItem("userUpiData", JSON.stringify({ upiId: "Scanned via QR" })); // store UPI ID in sessionStorage

            // Store the UPI ID in localStorage for main.html access
            let user = JSON.parse(localStorage.getItem('user')) || {};  // Get existing user data from localStorage
            user.upiID = upiId;  // Add the UPI ID
            localStorage.setItem('user', JSON.stringify(user));  // Save updated user object back to localStorage

            setTimeout(() => {
                window.location.href = "confirmation.html";
            }, 1500);
        }
    });

    function validateUpiId(upiId) {
        const validProviders = [
            'ybl', 'oksbi', 'okaxis', 'okhdfcbank', 'okicici', 'paytm', 'upi', 'oksbp'
        ];
    
        const upiRegex = /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9]+)$/;
        const match = upiId.match(upiRegex);
        if (!match) return false;
    
        const prefix = match[1];
        const provider = match[2].toLowerCase();
    
        // 1. Validate provider
        if (!validProviders.includes(provider)) return false;
    
        // 2. Validate prefix
        const isMobile = /^[1-9]\d{9}$/.test(prefix); // mobile
        const isValidName = /^[a-zA-Z][a-zA-Z0-9._-]*$/.test(prefix); // starts with a letter, rest allowed chars
    
        return isMobile || isValidName;
    }
    sessionStorage.removeItem("userUpiId");

    // In a real implementation, you would also:
    // 1. Generate a dynamic QR code with payment information
    // 2. Integrate with a UPI payment gateway like Razorpay, PayU, etc.
    // 3. Handle payment verification webhooks
    // 4. Implement a payment status polling mechanism
});

