import * as utils from '/scripts/userUtils.js'

document.addEventListener('DOMContentLoaded', () => {
    async function getDataFromServer() {

        //get the data from the server
        const data = await utils.fetchUserData();

        //set values as per data
        document.querySelector('.greetings h1').innerHTML = `Hi ${data.firstName},`;
    }
    getDataFromServer();

    const expenseContainer = document.querySelector('.expense-sub-container');
    function addExpense() {
        //create the expense element
        let expense = document.createElement('div');
        let expenseListTitle = document.createElement('p');
        let expenseListAmount = document.createElement('p');
        let expenseListEditIcon = document.createElement('i');
        let expenseListDeleteIcon = document.createElement('i');

        //add the classes
        expense.classList.add('expenses');
        expenseListTitle.classList.add('expense-list-title');
        expenseListAmount.classList.add('expense-list-amount');
        expenseListEditIcon.classList.add('fa-solid');
        expenseListDeleteIcon.classList.add('fa-solid');

        //add the values
    }

    let expenseInput = document.querySelector('#expense-input');
    function fetchExpenseData() {
        expenseInput.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(e.target);
            const data = {};

            formData.forEach((value, key) => data[key] = value);
            console.log(data);


        })
    }
    fetchExpenseData();
})