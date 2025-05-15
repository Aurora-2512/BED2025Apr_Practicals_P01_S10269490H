const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Get all students
async function getAllStudents() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT student_id, name, address FROM Students";
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
async function getStudentById(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT student_id, name, address FROM Students WHERE student_id = @id";
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

// Create new student
async function addStudent(studentData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      INSERT INTO Students (name, address)
      VALUES (@name, @address);
      SELECT SCOPE_IDENTITY() AS id;
    `;
    const request = connection.request();
    request.input("name", sql.NVarChar(100), studentData.name);
    request.input("address", sql.NVarChar(255), studentData.address);
    const result = await request.query(query);

    const newStudentId = result.recordset[0].id;
    return await getStudentById(newStudentId);
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
async function updateStudent(id, studentData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      UPDATE Students
      SET name = @name, address = @address
      WHERE student_id = @id
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

// Delete student by ID
async function deleteStudent(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "DELETE FROM Students WHERE student_id = @id";
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

module.exports = {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent
};
