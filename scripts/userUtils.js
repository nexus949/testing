/*This file contains a set of utility functions for retrieving and setting data from the server and session storage. 
When the user is redirected to the dashboard, user data is fetched from the server and is stored in the sessionStorage so that it persists
across dashboard and settings pages and can be accessed without redundant server requests. */

//set data in the session storage 
export function initializeUserData(data) {
    sessionStorage.setItem('userData', JSON.stringify(data));
}

//get data from sessionStorage
export function getUserData() {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
        return JSON.parse(userData);
    }
    else {
        return null;
    }
}

//get user data from the server if needed (everytime the tab is opened)
export async function fetchUserData() {
    try {
        const response = await fetch('/user/getUserData', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        initializeUserData(data); // Save to sessionStorage
        return data;
    }
    catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

//create message divs that display error messages recieved from the server
export function createMessageDiv(message) {
    let responseMessage = document.createElement('div');
    responseMessage.innerHTML = message;
    responseMessage.classList.add('response-messages');
    return responseMessage;
}

//displays error message and removes it after 8 seconds
export function showErrorMsg(element, message){
    //check if a message is already existing, if yes remove it immediately !
    let existingMsg = element.querySelector('div');
    if(existingMsg) existingMsg.remove();

    let responseMsg = createMessageDiv(message);
    element.append(responseMsg);
    setTimeout( () => { responseMsg.remove() }, 8000);
}

//adds validation messages that ensure passwords are in correct format ! 
//Args -> 1.Checks if validation message is already there, 2. The target Element where the message will be shown, 3. The message
export function addPasswordValidationMessage(hasPasswordMsg, element, message, classList) {

    //if the validation message is already there return immidiately. (nothing to add)
    if (hasPasswordMsg) return;

    let passwordValidationMessage = document.createElement('p');

    //by adding a class to it i can add the styles and access it again when i need to remove the message.
    passwordValidationMessage.classList.add(classList);

    //change the inner text and append the message to the element
    passwordValidationMessage.innerText = message;
    element.append(passwordValidationMessage);
}

//removes the validation message if everything is okay
export function removePasswordValidationMessage(hasPasswordMsg, classList) {

    //if validation message is not present return immediately. (nothing to remove)
    if (!hasPasswordMsg) return;

    let passwordValidationMessage = document.querySelector(`.${classList}`);
    passwordValidationMessage.remove();
}

//checks if both the passwords match or not
export function doPasswordsMatch(passwordField, confirmPasswordField) {
    if (passwordField.value !== confirmPasswordField.value) {
        return false;
    }
    else {
        return true;
    }
}