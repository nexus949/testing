document.addEventListener('DOMContentLoaded', () =>{
    document.querySelector('#forgot-password-form').addEventListener('submit', async function(e){
        e.preventDefault();

        const data = {
            email : `${document.querySelector('.forgot-pass-input').value}`
        };

        let response = await fetch('/user/password/forgotPassword', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })

        let responseData = await response.json();
        if(response.ok){
            alert(responseData.message);
        }
        else{
            console.log(responseData.message);
        }
    })
})