const express = require('express');
const router = express.Router();
const {
  addBook,
  getBooks,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

// POST: Add a Book
router.post('/', addBook);

// GET: Get All Books
router.get('/', getBooks);

// PUT: Update a Book
router.put('/:id', updateBook);

// DELETE: Delete a Book
router.delete('/:id', deleteBook);

module.exports = router;
