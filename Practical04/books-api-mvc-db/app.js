const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();

const bookController = require("./controllers/bookController");
const middleware=require("./middlewares/bookValidation")

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Routes for books
// Link specific URL paths to the corresponding controller functions
app.get("/books",middleware.validateBook, bookController.getAllBooks);
app.get("/books/:id",middleware.validateBookId, bookController.getBookById);
app.post("/books",middleware.validateBook, bookController.createBook);
app.put("/books/:id", middleware.validateBookId, middleware.validateBook, bookController.updateBook);
app.delete("/books/:id", middleware.validateBookId, bookController.deleteBook);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
// Listen for termination signals (like Ctrl+C)
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Close any open connections
  await sql.close();
  console.log("Database connections closed");
  process.exit(0); // Exit the process
});