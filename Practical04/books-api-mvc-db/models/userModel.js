const sql = require("mssql");
const dbConfig = require("../dbConfig");


async function createUser(user) {
    let connection;
    try{
        connection = await sql.connect(dbConfig)
        const query = `
            INSERT INTO Users (username, email)
            Values (@username, @email)
            SELECT SCOPE_IDENTITY() 
        `;
        const request = connection.request();
            request.input("username", sql.NVarChar(100), user.username);
            request.input("email", sql.NVarChar(255), user.email);
            const result = await request.query(query);

            const newUserId = result.recordset[0].id;
            return await getStudentById(newUserId);
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

// Get all user
async function getAllUsers() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT id, username, email FROM Users";
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

// Get student by ID
async function getUserById(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT id, username, email FROM Users WHERE id = @id";
    const request = connection.request();
    request.input("id", sql.Int, id);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return null;
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

// Update student by ID
async function updateUser(id, updatedUser) {
    let connection;
      try {
        connection = await sql.connect(dbConfig);
        const query = `
          UPDATE Users
          SET username = @username, email = @email
          WHERE id = @id
        `;
        const request = connection.request();
        request.input("id", sql.Int, id);
        request.input("name", sql.NVarChar(100), studentData.name);
        request.input("address", sql.NVarChar(255), studentData.address);
        const result = await request.query(query);
        return result; // result.rowsAffected[0] shows affected rows
      } catch (error) {
        console.error("Database error (update):", error);
        throw error;
      } finally {
        if (connection) await connection.close().catch(console.error);
      }
    }

async function deleteUser(id) {
    let connection;
      try {
        connection = await sql.connect(dbConfig);
        const query = "DELETE FROM Users WHERE id = @id";
        const request = connection.request();
        request.input("id", sql.Int, id);
        const result = await request.query(query);
        return result; // result.rowsAffected[0] shows affected rows
      } catch (error) {
        console.error("Database error (delete):", error);
        throw error;
      } finally {
        if (connection) await connection.close().catch(console.error);
      }
}

async function searchUsers(searchTerm) {
  let connection; // Declare connection outside try for finally access
  try {
    connection = await sql.connect(dbConfig);

    // Use parameterized query to prevent SQL injection
    const query = `
    SELECT *
    FROM Users
    WHERE username LIKE '%' + @searchTerm + '%'
        OR email LIKE '%' + @searchTerm + '%'
    `;

    const request = connection.request();
    request.input("searchTerm", sql.NVarChar, searchTerm); // Explicitly define type
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error("Database error in searchUsers:", error); // More specific error logging
    throw error; // Re-throw the error for the controller to handle
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection after searchUsers:", err);
      }
    }
  }
}
async function getUsersWithBooks() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);

    const query = `
    SELECT u.id AS user_id, u.username, u.email, b.id AS book_id, b.title, b.author
    FROM Users u
    LEFT JOIN UserBooks ub ON ub.user_id = u.id
    LEFT JOIN Books b ON ub.book_id = b.id
    ORDER BY u.username;
    `;

    const result = await connection.request().query(query);
    const usersWithBooks = {};
    for (const row of result.recordset) {
      const userId = row.user_id;
      if (!usersWithBooks[userId]) {
        usersWithBooks[userId] = {
          id: userId,
          username: row.username,
          email: row.email,
          books: [],
        };
      }
      // Only add book if book_id is not null (for users with no books)
      if (row.book_id !== null) {
        usersWithBooks[userId].books.push({
          id: row.book_id,
          title: row.title,
          author: row.author,
        });
      }
    }

    return Object.values(usersWithBooks);
  } catch (error) {
    console.error("Database error in getUsersWithBooks:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(
          "Error closing connection after getUsersWithBooks:",
          err
        );
      }
    }
  }
}
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
  getUsersWithBooks
};
