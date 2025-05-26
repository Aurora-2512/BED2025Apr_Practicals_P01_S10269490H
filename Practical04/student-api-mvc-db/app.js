const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const studentController = require("./controllers/studentController");
const studentValidation = require("./middlewares/studentValidation");

const app = express();
const port = process.env.PORT || 3000;

const path = require("path");
// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// --- STUDENT ROUTES ---
app.get("/students", studentValidation.validateStudent,studentController.getAllStudents);
app.get("/students/:id", studentValidation.validateStudentId, studentController.getStudentById);
app.post("/students", studentValidation.validateStudent, studentController.addStudent);
app.put("/students/:id", studentValidation.validateStudentId, studentValidation.validateStudent, studentController.updateStudent);
app.delete("/students/:id", studentValidation.validateStudentId, studentController.deleteStudent);

// Start the server
app.listen(port, async () => {
  try {
    await sql.connect(require("./dbConfig"));
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown on Ctrl+C
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await sql.close();
  console.log("Database connection closed");
  process.exit(0);
});
