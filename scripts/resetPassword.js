import * as utils from '/scripts/userUtils.js'

document.addEventListener('DOMContentLoaded', () =>{
    let hasPasswordMsg = false;
    let passwordField = document.querySelector('.reset-password');
    let passwordFieldLabel = document.querySelector('.reset-password-label');

    let resetButton = document.querySelector('.reset-password-button');
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    let hasConfirmPasswordMsg = false;
    let confirmPasswordField = document.querySelector('.reset-confirm-password');
    let confirmPasswordFieldLabel = document.querySelector('.reset-confirm-password-label');

    passwordField.addEventListener('input', () => {
        let isValid = regex.test(passwordField.value);

        if (!isValid) {
            utils.addPasswordValidationMessage(hasPasswordMsg, passwordFieldLabel, "Password must contain at least 6 characters with letters and digits.", 'password-validation-message');   
            hasPasswordMsg = true;
        }
        else {
            utils.removePasswordValidationMessage(hasPasswordMsg, 'password-validation-message');
            hasPasswordMsg = false;
        }

        handlePasswordMatch();
        checkPasswords();
    })

    confirmPasswordField.addEventListener('input', () => {
        handlePasswordMatch();
        checkPasswords();
    })

    function handlePasswordMatch(){
        let match = utils.doPasswordsMatch(passwordField, confirmPasswordField);

        // Handle confirm password field validation message
        if (!match) {
            utils.addPasswordValidationMessage(hasConfirmPasswordMsg, confirmPasswordFieldLabel, "Passwords Do not match !", "confirm-password-validation-message");
            hasConfirmPasswordMsg = true;
        } else {
            utils.removePasswordValidationMessage(hasConfirmPasswordMsg, 'confirm-password-validation-message');
            hasConfirmPasswordMsg = false;
        }
    }

    //this function dynamically enables the submit button provided both the password and the confirm password are the same
    function checkPasswords() {
        if (passwordField.value === confirmPasswordField.value) {
            resetButton.disabled = false;
        }
        else {
            resetButton.disabled = true;
        }
    }
})

document.querySelector('#reset-password-form').addEventListener('submit', async function(e){
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {};

    formData.forEach((value, key) => data[key] = value);

    try {
        const response = await fetch('/user/password/resetPassword', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        alert(responseData.message);
    }
    catch (error) {
        console.error("Error:", error);
    }
})