import * as utils from '/scripts/userUtils.js'

document.addEventListener('DOMContentLoaded', () =>{
    //clear sessionStorage if any
    sessionStorage.clear();

    document.querySelector('#login-form').addEventListener('submit', async function(e){
        e.preventDefault();
    
        const formData = new FormData(e.target);
        const data = {};
    
        formData.forEach((value, key) => data[key] = value);
        
        try {
            const response = await fetch('/user/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
    
            if (response.ok) {
                window.location.href = '/user/dashboard';
            }
            else{
                const errorData = await response.json();
                console.log(errorData);

                if(response.status === 404){
                    utils.showErrorMsg(document.querySelector('.email-label'), errorData.message);
                }   
                else if(response.status === 401){
                    utils.showErrorMsg(document.querySelector('.password-label'), errorData.message);
                }
                else{
                    alert(errorData.message);
                }
            }
        }
        catch (error) {
            console.error("Error:", error);
        }
    })
})