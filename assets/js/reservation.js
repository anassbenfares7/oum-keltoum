// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxcQn_kv6QziJpoqrV0J08RIMYtbcCKOKkvorUy7gBab87DpKaCf0U9bIuEDZJcK9UJ/exec';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reservationForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const spinner = submitBtn.querySelector('.spinner-border');
    const buttonText = submitBtn.querySelector('.button-text');
    const formAlert = document.getElementById('formAlert');

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    // Form validation and submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Reset previous validation state
        form.classList.remove('was-validated');
        hideAlert();

        // Basic validation
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        // Get form data
        const formData = {
            phone: document.getElementById('phone').value,
            people: document.getElementById('people').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            timestamp: new Date().toISOString()
        };

        // Additional validation
        if (!validatePhone(formData.phone)) {
            showAlert('Veuillez entrer un numéro de téléphone valide', 'danger');
            return;
        }

        if (!validateDate(formData.date)) {
            showAlert('La date ne peut pas être dans le passé', 'danger');
            return;
        }

        // Show loading state
        setLoading(true);

        try {
            // Send data to Google Sheets
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'no-cors'
            });

            // Show success message
            showAlert('Réservation confirmée', 'success');
            form.reset();
            form.classList.remove('was-validated');

        } catch (error) {
            showAlert('Erreur de réservation. Veuillez réessayer.', 'danger');
        }

        setLoading(false);
    });

    // Utility functions
    function validatePhone(phone) {
        return /^\d{8,}$/.test(phone);
    }

    function validateDate(date) {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    }

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        spinner.classList.toggle('d-none', !isLoading);
        buttonText.classList.toggle('d-none', isLoading);
    }

    function showAlert(message, type) {
        formAlert.textContent = message;
        formAlert.className = `alert alert-${type} text-center`;
        formAlert.classList.remove('d-none');
    }

    function hideAlert() {
        formAlert.classList.add('d-none');
    }
});
