const mongoose = require('mongoose');
const Author = require('../models/author');

exports.addAuthor = async (req, res, next) => {
  try {
    const { name, email, phoneNumber } = req.body;

    // Validate phone number format (exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format. Must be 10 digits.' });
    }

    const author = new Author({ name, email, phoneNumber });
    await author.save();
    res.status(201).json(author);
  } catch (err) {
    next(err);
  }
};

exports.getAuthors = async (req, res, next) => {
  try {
    const authors = await Author.find().populate('books');
    res.status(200).json(authors);
  } catch (err) {
    next(err);
  }
};

exports.updateAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Author ID' });
    }

    const updatedAuthor = await Author.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // Ensure schema validation
    });

    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(200).json(updatedAuthor);
  } catch (err) {
    next(err);
  }
};

exports.deleteAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Author ID' });
    }

    const deletedAuthor = await Author.findByIdAndDelete(id);

    if (!deletedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(200).json({ message: 'Author deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getAuthorsExceedingLimit = async (req, res, next) => {
  try {
    const authors = await Author.find().populate('books');
    const exceedingAuthors = authors.filter(author => author.books.length > 5);
    res.status(200).json(exceedingAuthors);
  } catch (err) {
    next(err);
  }
};
