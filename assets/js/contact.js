// Initialize EmailJS with your public key
(function() {
    emailjs.init("zu4dAJAq9XfJx0B_c"); // Replace with your EmailJS public key
})();

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-us form');
    const submitBtn = form.querySelector('.contact-button');
    const formAlert = document.createElement('div');
    formAlert.id = 'contactFormAlert';
    formAlert.className = 'alert d-none text-center mt-3';
    form.appendChild(formAlert);

    // Add loading spinner to button
    const spinner = document.createElement('div');
    spinner.className = 'spinner-border spinner-border-sm d-none';
    spinner.setAttribute('role', 'status');
    const buttonText = document.createElement('span');
    buttonText.className = 'button-text';
    buttonText.textContent = 'Send';
    
    const submitLink = submitBtn.querySelector('a');
    submitLink.textContent = ''; // Clear existing text
    submitLink.appendChild(spinner);
    submitLink.appendChild(buttonText);

    // Form validation and submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Reset previous validation state
        form.classList.remove('was-validated');
        hideAlert();

        // Get form inputs
        const username = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const phone = form.querySelector('input[placeholder="Phone"]').value;
        const message = form.querySelector('textarea').value;

        // Basic validation
        if (!username || !email || !phone || !message) {
            showAlert('Please fill in all fields', 'danger');
            return;
        }

        // Email validation
        if (!validateEmail(email)) {
            showAlert('Please enter a valid email address', 'danger');
            return;
        }

        // Phone validation
        if (!validatePhone(phone)) {
            showAlert('Please enter a valid phone number', 'danger');
            return;
        }

        // Show loading state
        setLoading(true);

        try {
            // Send email using EmailJS
            const response = await emailjs.send(
                "service_ly3ltxi", // Replace with your EmailJS service ID
                "template_7xp17ju", // Replace with your EmailJS template ID
                {
                    from_name: username,
                    from_email: email,
                    phone_number: phone,
                    message: message,
                }
            );

            if (response.status === 200) {
                // Show success message
                showAlert('Message sent successfully', 'success');
                form.reset();
                form.classList.remove('was-validated');
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            showAlert('Error sending message. Please try again.', 'danger');
            console.error('EmailJS Error:', error);
        }

        setLoading(false);
    });

    // Convert button to submit type
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
    });

    // Utility functions
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        return /^\d{8,}$/.test(phone);
    }

    function setLoading(isLoading) {
        submitBtn.style.pointerEvents = isLoading ? 'none' : 'auto';
        spinner.classList.toggle('d-none', !isLoading);
        buttonText.classList.toggle('d-none', isLoading);
    }

    function showAlert(message, type) {
        formAlert.textContent = message;
        formAlert.className = `alert alert-${type} text-center mt-3`;
        formAlert.classList.remove('d-none');
    }

    function hideAlert() {
        formAlert.classList.add('d-none');
    }
});
