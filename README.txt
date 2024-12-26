Library Management System
=========================
This project is a backend API for managing books, authors, and borrowers in a library system.

I implemented this system using Node.js with Express to create a backend API, and I used MongoDB as the database for storing data. I created three models: Books, Authors, and Borrowers, using Mongoose.
I added validations for each model, such as ensuring unique ISBNs for books, valid email and phone number formats for authors, and borrowing limits for borrowers based on their membership type. 
Relationships were implemented by linking books to authors using MongoDB references, with a rule that prevents an author from being linked to more than 5 books.

I created API routes to handle CRUD operations for books, authors, and borrowers. 
Business rules like borrowing limits, checking book availability, and managing borrowed books for borrowers were implemented in the borrowing and returning endpoints. 
I added error handling for invalid requests, such as borrowing books with no available copies or exceeding limits. 
Finally, I tested all the endpoints and business logic using Postman and all the edge cases were working perfectly here.