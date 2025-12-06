const axios = require('axios');

async function testExpenseCreation() {
    try {
        console.log('1. Registering user...');
        // Use a random email to avoid duplication errors
        const email = `test${Math.floor(Math.random() * 10000)}@example.com`;
        const userRes = await axios.post('http://localhost:5000/api/auth/signup', {
            name: 'Debug User',
            email: email,
            password: 'password123',
            currency: 'USD'
        });

        const token = userRes.data.token;
        console.log('User registered. Token:', token ? 'Received' : 'Missing');

        console.log('2. Creating expense...');
        const expenseRes = await axios.post('http://localhost:5000/api/expenses', {
            description: 'Test Expense',
            amount: 50,
            category: 'Food',
            paymentMethod: 'Cash',
            date: '2025-12-06'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Expense created:', expenseRes.data);
        console.log('SUCCESS: Backend is working.');

    } catch (error) {
        console.error('ERROR DETAILS:', error.code || error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
    }
}

testExpenseCreation();
