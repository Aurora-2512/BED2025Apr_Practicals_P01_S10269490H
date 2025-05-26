const apiBaseUrl = "http://localhost:3000";
const studentDetailsDiv = document.getElementById("studentDetails");

// Helper to get query parameter by name
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Fetch and display student details
async function fetchStudentDetails(studentId) {
  try {
    studentDetailsDiv.textContent = "Loading student details...";
    const response = await fetch(`${apiBaseUrl}/students/${studentId}`);
    if (!response.ok) throw new Error(`Student not found (status: ${response.status})`);

    const student = await response.json();
    studentDetailsDiv.innerHTML = `
      <h2>${student.name || "Unnamed Student"}</h2>
      <p><strong>Address:</strong> ${student.address || "N/A"}</p>
      <p><strong>ID:</strong> ${student.student_id}</p>
      
    `;

    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", goBack);
    } else {
      console.warn("Back button not found in DOM.");
      studentDetailsDiv.innerHTML += `<p style="color:orange;">Warning: Back button not found.</p>`;
    }
  } catch (error) {
    studentDetailsDiv.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
  }
}

// Go back to student list
function goBack() {
  window.location.href = "index.html"; // Adjust filename if needed
}

// On page load
const studentId = getQueryParam("id");
if (studentId) {
  fetchStudentDetails(studentId);
} else {
  studentDetailsDiv.innerHTML = `<p style="color:red;">No student ID provided in the URL.</p>`;
}
