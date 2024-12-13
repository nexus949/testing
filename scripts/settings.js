import * as utils from '/scripts/userUtils.js'

document.addEventListener('DOMContentLoaded', () => {
    //acc deletion confirmation popup
    let confirmationPopup = document.querySelector('.deletion-confirmation-popup');
    //acc deletion button
    let accountDeletionButton = document.querySelector('.delete-account-yes');
    //cancel acc deletion button
    let cancelAccountDeletionButton = document.querySelector('.delete-account-cancel');
    //logout buttons
    let logoutButton = document.querySelector('.logout-button');
    let logoutPopup = document.querySelector('.logout-popup')
    let cancelLogoutButton = document.querySelector('.logout-cancel');

    let deleteAccountButton = document.querySelector('.delete-account-button');

    // Overlay
    let overlay = document.createElement('div');
    overlay.classList.add('popup-overlay');
    document.body.appendChild(overlay);

    //functions for showing and hiding popups
    const showPopup = (popup) => {
        popup.style.display = 'block';
        overlay.style.display = 'block';
    };

    const hidePopup = (popup) => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    };

    deleteAccountButton.addEventListener('click', () => {
        //remove any input in the account deletion popup
        document.querySelector('.deletion-password').value = '';
    
        //remove error messages if any present
        let confirmationText = document.querySelector('.account-deletion-confirmation');
        if(confirmationText.childElementCount === 1) confirmationText.firstElementChild.remove(); 

        showPopup(confirmationPopup);
    });

    //are you sure you want to delete your account ? -> CANCEL
    cancelAccountDeletionButton.addEventListener('click', () => {
        hidePopup(confirmationPopup);
    });

    logoutButton.addEventListener('click', () => {
        showPopup(logoutPopup);
    })

    cancelLogoutButton.addEventListener('click', () => {
        hidePopup(logoutPopup);
    })

    // Close popup when clicking outside
    overlay.addEventListener('click', () => {
        hidePopup(confirmationPopup);
        hidePopup(logoutPopup);
    });

    //this function sends a password change request to the server
    function sendPasswordChangeReq(e) {
        e.preventDefault();

        let currentPasswordField = document.querySelector('.current-password-field');
        let newPasswordField = document.querySelector('.new-password-field');
        let confirmNewPasswordField = document.querySelector('.confirm-new-password-field');
        let passwordButton = document.querySelector('.update-pass-button');

        passwordButton.addEventListener('click', async function () {
            if (currentPasswordField.value === '' || newPasswordField.value === '' || confirmNewPasswordField.value === '') return;

            const formData = new FormData(e.target);
            const data = {};

            formData.forEach((value, key) => data[key] = value);

            let response = await fetch('/user/settings/changePassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            response = await response.json();
            if (response.ok) {
                console.log(response.message);
            }
            else {
                console.log(response.message);
                utils.showErrorMsg(document.querySelector('.account-deletion-confirmation'), response.message);
            };
        })
    }

    //dynamic input for password change
    function changePasswordSettings() {
        let changePassButton = document.querySelector('.change-password-button');

        changePassButton.addEventListener('click', () => {
            changePassButton.classList.add('disabled-buttons');
            changePassButton.disabled = true;

            let passwordChangeForm = document.querySelector('#change-password-send-request-form');
            passwordChangeForm.style.display = 'block';

            passwordChangeForm.addEventListener('submit', function (e) {
                sendPasswordChangeReq(e);
            })
        })
    }
    changePasswordSettings();

    //change the info save button to not disabled state if there is any change in the input fields
    let inputs = document.querySelectorAll('.first-name-input-field, .last-name-input-field, .email-input-field');
    let saveButton = document.querySelector('.info-submit-button');

    inputs.forEach(input => {
        input.addEventListener('input', () =>{
            //from the nodeList of inputs return true if some of its value has changed (return true if condition is met)
            let hasChanged = Array.from(inputs).some(inputField => inputField.value !== inputField.defaultValue);

            //enabled the saveButton if there is a change in the input fields. (hasChanged = true then saveButton.disabled = false [!hasChanged])
            saveButton.disabled = !hasChanged
            saveButton.classList.toggle('non-disabled-buttons', hasChanged);
            saveButton.classList.toggle('disabled-buttons', !hasChanged);
        })
    })

    async function setUserData() {
        const data = await utils.getUserData();

        document.querySelector('.first-name-input-field').defaultValue = data.firstName;
        document.querySelector('.last-name-input-field').defaultValue = data.lastName;
        document.querySelector('.email-input-field').defaultValue = data.email;
    }
    setUserData();

    //updates user data
    function updateUserData() {
        let infoForm = document.querySelector('#info-change-form');

        infoForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(e.target);
            const data = {};

            formData.forEach((value, key) => data[key] = value);

            let response = await fetch('/user/settings/updateInfo', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            let jsonResponse = await response.json();

            if (response.ok) {
                console.log(jsonResponse);

                sessionStorage.clear();
                await utils.fetchUserData();
                setUserData();
            }

        })
    }
    updateUserData();

    function logOutUser() {
        document.querySelector('.logout-yes').addEventListener('click', async function (e) {
            e.preventDefault();

            let response = await fetch('/user/settings/logout', {
                method: 'POST'
            });

            if (response.ok) {
                sessionStorage.clear();
                window.location.href = '/user/login';
            }
        })
    }
    logOutUser();

    function deleteUserAccount() {
        accountDeletionButton.addEventListener('click', async function () {
            let deletionPasswordField = document.querySelector('.deletion-password');
            if (deletionPasswordField.value === '') return;

            let response = await fetch('/user/settings/deleteUser', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: deletionPasswordField.value.trim() })
            });

            if (response.ok) {
                window.location.href = '/'
            }
            else {
                response = await response.json();
                utils.showErrorMsg(document.querySelector('.account-deletion-confirmation'), response.message);
            };
        })
    }
    deleteUserAccount();
});
