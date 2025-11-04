// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxcQn_kv6QziJpoqrV0J08RIMYtbcCKOKkvorUy7gBab87DpKaCf0U9bIuEDZJcK9UJ/exec';

document.addEventListener('DOMContentLoaded', function() {
    try {
        const form = document.getElementById('reservationForm');
        if (!form) {
            console.error('Reservation form not found');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const spinner = submitBtn ? submitBtn.querySelector('.spinner-border') : null;
        const buttonText = submitBtn ? submitBtn.querySelector('.button-text') : null;
        const formAlert = document.getElementById('formAlert');

    // Set minimum date to today
    try {
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
    } catch (error) {
        console.error('Error setting minimum date:', error);
    }

    // Form validation and submission
    form.addEventListener('submit', async function(e) {
        try {
            e.preventDefault();

            // Reset previous validation state
            form.classList.remove('was-validated');
            hideAlert();

            // Basic validation
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }

            // Get form data with null checks
            const phoneInput = document.getElementById('phone');
            const peopleInput = document.getElementById('people');
            const dateInput = document.getElementById('date');
            const timeInput = document.getElementById('time');

            const formData = {
                phone: phoneInput ? phoneInput.value : '',
                people: peopleInput ? peopleInput.value : '',
                date: dateInput ? dateInput.value : '',
                time: timeInput ? timeInput.value : '',
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
                console.error('Reservation submission error:', error);
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            showAlert('Une erreur inattendue est survenue. Veuillez réessayer.', 'danger');
        } finally {
            setLoading(false);
        }
    });

    // Utility functions
    function validatePhone(phone) {
        try {
            return /^\d{8,}$/.test(phone);
        } catch (error) {
            console.error('Error validating phone:', error);
            return false;
        }
    }

    function validateDate(date) {
        try {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate >= today;
        } catch (error) {
            console.error('Error validating date:', error);
            return false;
        }
    }

    function setLoading(isLoading) {
        try {
            if (submitBtn) submitBtn.disabled = isLoading;
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
                formAlert.className = `alert alert-${type} text-center`;
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
        console.error('Error initializing reservation form:', error);
    }
});
