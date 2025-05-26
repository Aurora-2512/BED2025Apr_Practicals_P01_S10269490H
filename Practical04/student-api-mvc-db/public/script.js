// Get references to the HTML elements you'll interact with:
const studentsListDiv = document.getElementById("studentsList");
const fetchStudentsBtn = document.getElementById("fetchStudentsBtn");
const messageDiv = document.getElementById("message"); // For success/error messages
const apiBaseUrl = "http://localhost:3000";

// Function to fetch students from the API and display them
async function fetchStudents() {
  try {
    studentsListDiv.innerHTML = "Loading students..."; // Show loading state
    messageDiv.textContent = ""; // Clear any previous messages

    // Make a GET request to your API endpoint
    const response = await fetch(`${apiBaseUrl}/students`);

    if (!response.ok) {
      // Handle HTTP errors
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody.message}`
      );
    }

    // Parse the JSON response
    const students = await response.json();

    // Clear previous content and display students
    studentsListDiv.innerHTML = ""; // Clear loading message
    if (students.length === 0) {
      studentsListDiv.innerHTML = "<p>No students found.</p>";
    } else {
      students.forEach((student) => {
        const studentElement = document.createElement("div");
        studentElement.classList.add("student-item");
        studentElement.setAttribute("data-student-id", student.student_id);
        studentElement.innerHTML = `
          <h3>${student.name}</h3>
          <p>Address: ${student.address}</p>
          <p>ID: ${student.student_id}</p>
          <button onclick="viewStudentDetails(${student.student_id})">View Details</button>
          <button onclick="editStudent(${student.student_id})">Edit</button>
          <button class="delete-btn" data-id="${student.student_id}">Delete</button>
        `;
        studentsListDiv.appendChild(studentElement);
      });

      // Add event listeners for delete buttons after they are added to the DOM
      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", handleDeleteClick);
      });
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    studentsListDiv.innerHTML = `<p style="color: red;">Failed to load students: ${error.message}</p>`;
  }
}

// Placeholder functions for other actions
function viewStudentDetails(studentId) {
  console.log("View details for student ID:", studentId);
  // In a real app, redirect to view page
   window.location.href = `view.html?id=${studentId}`;
  //alert(`View details for student ID: ${studentId} (Not implemented yet)`);
}

function editStudent(studentId) {
  console.log("Edit student with ID:", studentId);
  // Redirect to edit page
  window.location.href = `edit-student.html?id=${studentId}`;
}

// Placeholder/Partial implementation for Delete (to be completed)
async function handleDeleteClick(event) {
  const studentId = event.target.getAttribute("data-id");

  const confirmDelete = confirm("Are you sure you want to delete this student?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${apiBaseUrl}/students/${studentId}`, {
      method: "DELETE",
    });

    if (response.status === 200|| response.status === 204) {
      const studentElement = event.target.closest(".student-item");
      studentElement.remove();

      messageDiv.textContent = `Student ID ${studentId} deleted successfully.`;
      messageDiv.style.color = "green";
      return;
      
    }
    else {
      // Handle known error responses
       throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("Delete error:", error);
    messageDiv.textContent = `Failed to delete student: ${error.message}`;
    messageDiv.style.color = "red";
  }
}
// Fetch students when the button is clicked
fetchStudentsBtn.addEventListener("click", fetchStudents);

// Optionally, fetch students when the page loads
window.addEventListener('load', fetchStudents);
// or just call fetchStudents();
