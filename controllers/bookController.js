const mongoose = require('mongoose');
const Book = require('../models/book');
const Author = require('../models/author');

// Add a new book
exports.addBook = async (req, res, next) => {
  try {
    const { title, author, isbn, availableCopies } = req.body;

    // Check if the author exists
    const authorExists = await Author.findById(author);
    if (!authorExists) {
      return res.status(400).json({ error: 'Author not found' });
    }

    // Check if the author already has 5 books
    const booksByAuthor = await Book.find({ author });
    if (booksByAuthor.length >= 5) {
      return res.status(400).json({
        error: 'Author cannot be linked to more than 5 books.',
      });
    }

    // Create and save the book
    const book = new Book({ title, author, isbn, availableCopies });
    await book.save();

    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

// Get all books
exports.getBooks = async (req, res, next) => {
  try {
    const books = await Book.find().populate('author', 'name email');
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};

// Get a single book by ID
exports.getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Book ID' });
    }

    const book = await Book.findById(id).populate('author', 'name email');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
};

// Update a book
exports.updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { author } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Book ID' });
    }

    // Check if the author exists and enforce the 5-book limit if author is updated
    if (author) {
      const authorExists = await Author.findById(author);
      if (!authorExists) {
        return res.status(400).json({ error: 'Author not found' });
      }

      const booksByAuthor = await Book.find({ author });
      if (booksByAuthor.length >= 5) {
        return res.status(400).json({
          error: 'Author cannot be linked to more than 5 books.',
        });
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(updatedBook);
  } catch (err) {
    next(err);
  }
};

// Delete a book
exports.deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Book ID' });
    }

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Get books by author
exports.getBooksByAuthor = async (req, res, next) => {
  try {
    const { authorId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({ error: 'Invalid Author ID' });
    }

    const books = await Book.find({ author: authorId }).populate('author', 'name email');

    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};
