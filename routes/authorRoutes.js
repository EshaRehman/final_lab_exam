const express = require('express');
const router = express.Router();
const {
  addAuthor,
  getAuthors,
  updateAuthor,
  deleteAuthor,
  getAuthorsExceedingLimit
} = require('../controllers/authorController');

// POST: Add Author
router.post('/', addAuthor);

// GET: Get All Authors
router.get('/', getAuthors);

// PUT: Update Author
router.put('/:id', updateAuthor);

// DELETE: Delete Author
router.delete('/:id', deleteAuthor);

// GET: Get Authors Exceeding Book Limit
router.get('/exceeding-limit', getAuthorsExceedingLimit);

module.exports = router;
