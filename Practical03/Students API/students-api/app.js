const express = require("express");
const sql = require("mssql"); // Assuming you've installed mssql
const dbConfig = require("./dbConfig");

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

app.use(express.json()); // middleware inbuilt in express to recognize the incoming Request Object as a JSON Object.
app.use(express.urlencoded()); // middleware inbuilt in express to recognize the incoming Request Object as strings or arrays

app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});

// --- GET Routes  ---

// GET all students
app.get("/students", async (req, res) => {
    let connection; // Declare connection outside try for finally block
    try {
      connection = await sql.connect(dbConfig); // Get the database connection
      const sqlQuery = `SELECT * FROM Students`; // Select specific columns
      const request = connection.request();
      const result = await request.query(sqlQuery);
      res.json(result.recordset); // Send the result as JSON
    } catch (error) {
      console.error("Error in GET /students:", error);
      res.status(500).send("Error retrieving students"); // Send a 500 error on failure
    } finally {
      if (connection) {
        try {
          await connection.close(); // Close the database connection
        } catch (closeError) {
          console.error("Error closing database connection:", closeError);
        }
      }
    }
  });
  
  // GET book by ID
  app.get("/students/:id", async (req, res) => {
    const bookId = parseInt(req.params.id);
    if (isNaN(bookId)) {
      return res.status(400).send("Invalid student ID");
    }
  
    let connection;
    try {
      connection = await sql.connect(dbConfig); // Get the database connection
      const sqlQuery = `SELECT * FROM Students WHERE student_id = @id`;
      const request = connection.request();
      request.input("id", sql.Int, studentId); // Bind the id parameter
      const result = await request.query(sqlQuery);
  
      if (!result.recordset[0]) {
        return res.status(404).send("Student not found");
      }
      res.json(result.recordset[0]); // Send the student data as JSON
    } catch (error) {
      console.error(`Error in GET /books/${bookId}:`, error);
      res.status(500).send("Error retrieving book");
    } finally {
      if (connection) {
        try {
          await connection.close(); // Close the database connection
        } catch (closeError) {
          console.error("Error closing database connection:", closeError);
        }
      }
    }
  });

// --- POST Route  ---

// POST create new book
app.post("/students", async (req, res) => {
    const {name,address} = req.body; // Get new book data from request body
  
    // **WARNING:** No validation is performed here. Invalid data may cause database errors. We will implement the necessary validation in future practicals.
  
    let connection;
    try {
      connection = await sql.connect(dbConfig); // Get the database connection
      const sqlQuery = `INSERT INTO Students (name, address) VALUES (@name, @address); SELECT SCOPE_IDENTITY() AS id;`;
      const request = connection.request();
      // Bind parameters from the request body
      request.input("name", sql.NVarChar(100), name);
      request.input("address", sql.NVarChar(255), address);
      const result = await request.query(sqlQuery);
  
      // Attempt to fetch the newly created book to return it
      const newId = result.recordset[0].id;
  
      // Directly fetch the new book here instead of calling a function
      // Re-using the same connection before closing it in finally
      const getNewStudentQuery = `SELECT * FROM Students WHERE student_id = @id`;
      const getNewStudentRequest = connection.request();
      getNewStudentRequest.input("id", sql.Int, newId);
      const newStudentResult = await getNewStudentRequest.query(getNewStudentQuery);
  
      res.status(201).json(newStudentResult.recordset[0]); // Send 201 Created status and the new book data
    } catch (error) {
      console.error("Error in POST /books:", error);
      // Database errors due to invalid data (e.g., missing required fields) will likely be caught here
      res.status(500).send("Error creating student");
    } finally {
      if (connection) {
        try {
          await connection.close(); // Close the database connection
        } catch (closeError) {
          console.error("Error closing database connection:", closeError);
        }
      }
    }
  });

// --- PUT Route  ---

// PUT update new student
app.put("/students/:id", async (req, res) => {
    const studentId = parseInt(req.params.id);
    const { name, address } = req.body;
    let connection;
    try {
      connection = await sql.connect(dbConfig);// Connect to database

    const updateQuery = `
      UPDATE Students SET name = @name, address = @address WHERE student_id = @id
    `;
    const updateRequest = connection.request();
    updateRequest.input("id", sql.Int, studentId);
    updateRequest.input("name", sql.NVarChar(100), name);
    updateRequest.input("address", sql.NVarChar(255), address);

    const updateResult = await updateRequest.query(updateQuery);

    if (updateResult.rowsAffected[0] === 0) {
      // No book was updated, possibly invalid ID
      return res.status(404).send("Student not found");
    }

    // Fetch the updated book to return it
    const getUpdatedBookQuery = `SELECT * FROM Students WHERE student_id = @id`;
    const getUpdatedStudentRequest = connection.request();
    getUpdatedStudentRequest.input("id", sql.Int, studentId);
    const updatedStudentResult = await getUpdatedStudentRequest.query(getUpdatedBookQuery);

    res.status(200).json(updatedStudentResult.recordset[0]); // Return updated book

  } catch (error) {
    console.error("Error in PUT /students/:id:", error);
    res.status(500).send("Error updating students");
  } finally {
    if (connection) {
      try {
        await connection.close(); // Always close connection
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }
});

// --- Delete Route  ---

// DELETE the book
app.delete("/students/:id", async (req, res) => {
  const studentId = parseInt(req.params.id); // Extract book ID from URL

  let connection;
  try {
    connection = await sql.connect(dbConfig); // Acquire DB connection

    const deleteQuery = `
      DELETE FROM Students WHERE student_id = @id
    `;
    const deleteRequest = connection.request();
    deleteRequest.input("id", sql.Int, studentId);

    const deleteResult = await deleteRequest.query(deleteQuery);

    if (deleteResult.rowsAffected[0] === 0) {
      // Book not found
      return res.status(404).send("Student not found");
    }

    // Deletion successful - return 204 No Content
    res.sendStatus(204);
  } catch (error) {
    console.error("Error in DELETE /students/:id:", error);
    res.status(500).send("Error deleting student");
  } finally {
    if (connection) {
      try {
        await connection.close(); // Close connection
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }
});

  