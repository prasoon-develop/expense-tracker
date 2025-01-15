// DOM Core Selectors
const balance = document.getElementById('total-balance');
const income = document.getElementById('total-income');
const expense = document.getElementById('total-expense');
const list = document.getElementById('transaction-list');
const form = document.getElementById('exp-form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const saveBtn = document.getElementById('save-state-btn');

// STATE CONTROLLER: Application always boots up with a clean zero baseline array
let transactions = [];

// Add New Transaction (Temporary Application State Only)
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please enter a valid transaction description and amount');
        return;
    }

    const transaction = {
        id: generateID(),
        text: text.value.trim(),
        amount: +amount.value.trim() // Force conversion to numerical scale safely
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();

    // Reset Form Input Layouts
    text.value = '';
    amount.value = '';
}

// Generate Unique Engine ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Render Core Elements inside DOM History Pipeline
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    
    // Dynamically allocate UI border flags
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">Delete</button>
    `;

    list.appendChild(item);
}

// Math Computation Core using functional Array operations (Map, Filter, Reduce)
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const totalIncome = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const totalExpense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    balance.innerText = `₹${total}`;
    income.innerText = `+ ₹${totalIncome}`;
    expense.innerText = `- ₹${totalExpense}`;
}

// Remove Transaction from current staging list
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    init();
}

// USER DRIVEN ACTION: LocalStorage is synced ONLY upon deliberate confirmation
function saveCurrentStatePermanently() {
    if (transactions.length === 0) {
        alert("Transaction ledger is empty! Please add entries before saving.");
        return;
    }
    localStorage.setItem('transactions', JSON.stringify(transactions));
    alert('✨ Ledger session successfully saved to system persistent cache!');
}

// Explicit startup checking loop to request manual restore validation
function checkSavedSession() {
    const cachedData = JSON.parse(localStorage.getItem('transactions'));
    if (cachedData && cachedData.length > 0) {
        if (confirm("We recovered a permanently locked profile session. Would you like to restore it?")) {
            transactions = cachedData;
            init();
        }
    }
}

// Base System Loop Initializer
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Kickstart system rendering loop
init();
setTimeout(checkSavedSession, 400); // Clean scheduling trigger loop

// Operational Pipeline Listeners
form.addEventListener('submit', addTransaction);
saveBtn.addEventListener('click', saveCurrentStatePermanently);