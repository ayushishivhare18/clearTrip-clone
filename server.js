const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Signup endpoint
app.post('/signup', (req, res) => {
    const { name, email, password, gender, apptype } = req.body;
    // Add your signup logic here
    res.json({ status: 'success', message: 'User created successfully', data: { user: { name, email } }, token: 'your-jwt-token' });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password, apptype } = req.body;
    // Add your login logic here
    res.json({ status: 'success', message: 'Login successful', data: { name: 'John Doe' }, token: 'your-jwt-token' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
