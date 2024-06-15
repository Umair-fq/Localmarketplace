// const express = require('express');
// const dbConnection = require('./Database/DbConfig');
// const app = express();
// require('dotenv').config();
// const cors = require('cors')
// const userRoutes = require('./Routers/UserRoutes')
// const productRoutes = require('./Routers/ProductRoutes')

// app.use(cors());

// const port = process.env.PORT || 8000;
// // calling dbconnection for connection of database
// dbConnection();

// // Correct usage of app.use()
// app.use(express.json()); 

// app.get('/', (req, res) => {
//     res.send('Welcome to the BloomEase Server!');
// });
// app.use(userRoutes);
// app.use('/api/product', productRoutes)

// app.listen(port, () => {
//     console.log(`listening on port ${port}`)
// })


const express = require('express');
const dbConnection = require('./Database/DbConfig');
const app = express();
require('dotenv').config();
const cors = require('cors');
const userRoutes = require('./Routers/UserRoutes');
const productRoutes = require('./Routers/ProductRoutes');

// Setup CORS to allow requests from your mobile app
app.use(cors({
    origin: true, // Reflect the request origin, as defined by the request header
    credentials: true // Allow sending cookies from the client
}));

// Port setup
const port = process.env.PORT || 8000;

// Initialize database connection
dbConnection();

// Middleware to parse JSON bodies
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the BloomEase Server!');
});

// User and Product Routes
app.use('/api/user', userRoutes);  // Make sure this is consistent with your client-side API requests
app.use('/api/product', productRoutes);

// Starting the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
});

// Error handling middleware (optional but useful)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
