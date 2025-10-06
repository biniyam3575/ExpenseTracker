const addBtn = document.getElementById("addBtn");
const tableBody = document.querySelector("#expenseTable tbody");
const totalDisplay = document.getElementById("total");

document.addEventListener('DOMContentLoaded', function() {
    loadExpenses();
    calculate();
});

addBtn.addEventListener("click", () => {
    const category = document.getElementById("category").value;
    const amount = document.getElementById("amount").value.trim();
    const date = document.getElementById("date").value;

    if (!amount || isNaN(amount)) {
        alert("Please fill the correct amount");
        return;
    }

    const expense = {
        category: category,
        amount: parseFloat(amount).toFixed(2),
        date: date
    };

    addExpenseToTable(expense);
    saveExpense(expense);

    document.getElementById("amount").value = "";
    calculate();
});

function addExpenseToTable(expense) {
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${expense.category}</td>
        <td class="amount">$${expense.amount}</td>
        <td>${expense.date}</td>
        <td class="deleteBtn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
        </svg></td>
    `;

    tableBody.appendChild(newRow);

    newRow.querySelector(".deleteBtn").addEventListener("click", () => {
        if (confirm("Are you sure to delete this from the list")) {
            newRow.remove();
            removeExpenseFromStorage(expense);
            calculate();
        }
    });
}

function saveExpense(expense) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function loadExpenses() {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.forEach(expense => {
        addExpenseToTable(expense);
    });
}

function removeExpenseFromStorage(expenseToRemove) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    
    expenses = expenses.filter(expense => 
        expense.category !== expenseToRemove.category ||
        expense.amount !== expenseToRemove.amount ||
        expense.date !== expenseToRemove.date
    );
    
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

document.getElementById("date").value = new Date().toISOString().split("T")[0];

document.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addBtn.click();
    }
});

function calculate() {
    let amounts = document.getElementsByClassName("amount");
    let total = 0;

    for (let i = 0; i < amounts.length; i++) {
        let value = parseFloat(amounts[i].textContent.replace('$', '').trim());
        if (!isNaN(value)) {
            total += value;
        }
    }

    totalDisplay.textContent = total.toFixed(2);
}
