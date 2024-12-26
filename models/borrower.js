const mongoose = require('mongoose');

const borrowerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  borrowedBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
  membershipActive: {
    type: Boolean,
    required: true,
  },
  membershipType: {
    type: String,
    required: true,
    enum: ['Standard', 'Premium'],
  },
});

borrowerSchema.methods.canBorrow = function () {
  const borrowingLimit = this.membershipType === 'Premium' ? 10 : 5;
  return this.borrowedBooks.length < borrowingLimit;
};

const Borrower = mongoose.model('Borrower', borrowerSchema);

module.exports = Borrower;
