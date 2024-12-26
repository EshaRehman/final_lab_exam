const express = require('express');
const router = express.Router();
const {
  addBorrower,
  getBorrowers,
  updateBorrower,
  deleteBorrower,
  borrowBook,
  returnBook
} = require('../controllers/borrowerController');

// POST: Add a Borrower
router.post('/', addBorrower);

// GET: Get All Borrowers
router.get('/', getBorrowers);

// PUT: Update a Borrower
router.put('/:id', updateBorrower);

// DELETE: Delete a Borrower
router.delete('/:id', deleteBorrower);

// POST: Borrow a Book
router.post('/borrow', borrowBook);

// POST: Return a Book
router.post('/return', returnBook);

module.exports = router;
