const sql = require("mssql");
const dbConfig = require("../dbConfig");


// Get all books
async function getAllBooks() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT id, title, author FROM Books";
    const result = await connection.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Get book by ID
async function getBookById(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT id, title, author FROM Books WHERE id = @id";
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return null; // Book not found
    }

    return result.recordset[0];
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Create new book
async function createBook(bookData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "INSERT INTO Books (title, author) VALUES (@title, @author); SELECT SCOPE_IDENTITY() AS id;";
    const request = connection.request();
    request.input("title", bookData.title);
    request.input("author", bookData.author);
    const result = await request.query(query);

    const newBookId = result.recordset[0].id;
    return await getBookById(newBookId);
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Update book by ID
async function updateBook(id, bookData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      UPDATE Books
      SET title = @title, author = @author
      WHERE id = @id
    `;
    const request = connection.request();
    request.input("id", id);
    request.input("title", bookData.title);
    request.input("author", bookData.author);
    const result = await request.query(query);
    return result; // result.rowsAffected[0] shows how many rows were updated
  } catch (error) {
    console.error("Database error (update):", error);
    throw error;
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
}

// Delete book by ID
async function deleteBook(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "DELETE FROM Books WHERE id = @id";
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(query);
    return result; // result.rowsAffected[0] shows how many rows were deleted
  } catch (error) {
    console.error("Database error (delete):", error);
    throw error;
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
}


module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};