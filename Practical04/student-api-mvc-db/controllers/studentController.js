const studentModel = require("../models/studentModel");

// Get all books
async function getAllStudents(req, res) {
  try {
    const students = await studentModel.getAllStudents();
    res.json(students);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving students" });
  }
}

// Get book by ID
async function getStudentById(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    const student = await studentModel.getStudentById(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving student" });
  }
}

// Create new book
async function addStudent(req, res) {
  try {
    const newStudent = await studentModel.addStudent(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating student" });
  }
}

//Update Book
async function updateStudent(req, res) {
  try {
    const id = parseInt(req.params.id);
    const updatedData = req.body;

    const result = await studentModel.updateStudent(id, updatedData);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error updating student" });
  }
}

//Delete Book
async function deleteStudent(req, res) {
  try {
    const id = parseInt(req.params.id);

    const result = await studentModel.deleteStudent(id);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error deleting student" });
  }
}

module.exports = {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent
};