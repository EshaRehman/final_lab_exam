const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const authorRoutes = require('./routes/authorRoutes');
const bookRoutes = require('./routes/bookRoutes');
const borrowerRoutes = require('./routes/borrowerRoutes');

const app = express();
connectDB();

// Middleware for parsing JSON
app.use(express.json());

// API Routes
app.use('/api/authors', authorRoutes); // Authors
app.use('/api/books', bookRoutes);     // Books
app.use('/api/borrowers', borrowerRoutes); // Borrowers

// Root Route (Optional)
app.get('/', (req, res) => {
  res.send('Library Management System API is running...');
});

// Error Handling Middleware
app.use(errorHandler);

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
