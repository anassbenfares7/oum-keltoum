// Initialize EmailJS with your public key
(function() {
    try {
        emailjs.init("zu4dAJAq9XfJx0B_c"); // Replace with your EmailJS public key
    } catch (error) {
        console.error('Error initializing EmailJS:', error);
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    try {
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
        try {
            e.preventDefault();

            // Reset previous validation state
            form.classList.remove('was-validated');
            hideAlert();

            // Get form inputs with null checks
            const nameInput = form.querySelector('input[type="text"]');
            const emailInput = form.querySelector('input[type="email"]');
            const phoneInput = form.querySelector('input[placeholder="Phone"]');
            const messageInput = form.querySelector('textarea');

            const username = nameInput ? nameInput.value : '';
            const email = emailInput ? emailInput.value : '';
            const phone = phoneInput ? phoneInput.value : '';
            const message = messageInput ? messageInput.value : '';

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

        } catch (error) {
            console.error('Error during form submission:', error);
            showAlert('An unexpected error occurred. Please try again.', 'danger');
        } finally {
            setLoading(false);
        }
    });

    // Convert button to submit type
    submitBtn.addEventListener('click', function(e) {
        try {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        } catch (error) {
            console.error('Error handling button click:', error);
        }
    });

    // Utility functions
    function validateEmail(email) {
        try {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        } catch (error) {
            console.error('Error validating email:', error);
            return false;
        }
    }

    function validatePhone(phone) {
        try {
            return /^\d{8,}$/.test(phone);
        } catch (error) {
            console.error('Error validating phone:', error);
            return false;
        }
    }

    function setLoading(isLoading) {
        try {
            submitBtn.style.pointerEvents = isLoading ? 'none' : 'auto';
            if (spinner) spinner.classList.toggle('d-none', !isLoading);
            if (buttonText) buttonText.classList.toggle('d-none', isLoading);
        } catch (error) {
            console.error('Error setting loading state:', error);
        }
    }

    function showAlert(message, type) {
        try {
            if (formAlert) {
                formAlert.textContent = message;
                formAlert.className = `alert alert-${type} text-center mt-3`;
                formAlert.classList.remove('d-none');
            }
        } catch (error) {
            console.error('Error showing alert:', error);
        }
    }

    function hideAlert() {
        try {
            if (formAlert) {
                formAlert.classList.add('d-none');
            }
        } catch (error) {
            console.error('Error hiding alert:', error);
        }
    }
    } catch (error) {
        console.error('Error initializing contact form:', error);
    }
});
