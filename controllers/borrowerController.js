const mongoose = require('mongoose');
const Borrower = require('../models/borrower');
const Book = require('../models/book');

// Add a new borrower
exports.addBorrower = async (req, res, next) => {
  try {
    const borrower = new Borrower(req.body);
    await borrower.save();
    res.status(201).json(borrower);
  } catch (err) {
    next(err);
  }
};

// Get all borrowers
exports.getBorrowers = async (req, res, next) => {
  try {
    const borrowers = await Borrower.find().populate('borrowedBooks');
    res.status(200).json(borrowers);
  } catch (err) {
    next(err);
  }
};

// Update a borrower
exports.updateBorrower = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Borrower ID' });
    }

    const updatedBorrower = await Borrower.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBorrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }

    res.status(200).json(updatedBorrower);
  } catch (err) {
    next(err);
  }
};

// Delete a borrower
exports.deleteBorrower = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Borrower ID' });
    }

    const deletedBorrower = await Borrower.findByIdAndDelete(id);

    if (!deletedBorrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }

    res.status(200).json({ message: 'Borrower deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Borrow a book
exports.borrowBook = async (req, res, next) => {
  try {
    const { borrowerId, bookId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(borrowerId) || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'Invalid IDs provided' });
    }

    const borrower = await Borrower.findById(borrowerId);
    const book = await Book.findById(bookId);

    if (!borrower || !borrower.membershipActive) {
      return res.status(400).json({ error: 'Borrower is not active or does not exist' });
    }

    const borrowingLimit = borrower.membershipType === 'Premium' ? 10 : 5;

    if (borrower.borrowedBooks.length >= borrowingLimit) {
      return res.status(400).json({ error: 'Borrower has reached their borrowing limit' });
    }

    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ error: 'No copies available for this book' });
    }

    borrower.borrowedBooks.push(book._id);
    book.availableCopies -= 1;

    await borrower.save();
    await book.save();

    res.status(200).json({ message: 'Book borrowed successfully' });
  } catch (err) {
    next(err);
  }
};

// Return a book
exports.returnBook = async (req, res, next) => {
  try {
    const { borrowerId, bookId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(borrowerId) || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'Invalid IDs provided' });
    }

    const borrower = await Borrower.findById(borrowerId);
    const book = await Book.findById(bookId);

    if (!borrower || !book) {
      return res.status(404).json({ error: 'Borrower or Book not found' });
    }

    // Remove the book from borrower's borrowedBooks array
    borrower.borrowedBooks = borrower.borrowedBooks.filter(
      (borrowedBookId) => borrowedBookId.toString() !== bookId
    );

    // Increment the availableCopies of the book
    book.availableCopies += 1;

    await borrower.save();
    await book.save();

    res.status(200).json({ message: 'Book returned successfully' });
  } catch (err) {
    next(err);
  }
};
