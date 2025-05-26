// Get references to the form and message elements:
const createStudentForm = document.getElementById("createStudentForm");
const messageDiv = document.getElementById("message");
const apiBaseUrl = "http://localhost:3000";

createStudentForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the default form submission

  messageDiv.textContent = ""; // Clear previous messages

  // Collect data from the form inputs
  const nameInput = document.getElementById("name");
  const addressInput = document.getElementById("address");

  const newStudentData = {
    name: nameInput.value.trim(),
    address: addressInput.value.trim(),
  };

  try {
    // Make a POST request to your API endpoint
    const response = await fetch(`${apiBaseUrl}/students`, {
      method: "POST", // HTTP method
      headers: {
        "Content-Type": "application/json", // Sending JSON
      },
      body: JSON.stringify(newStudentData), // Request body
    });

    // Parse response body
    const responseBody = response.headers
      .get("content-type")
      ?.includes("application/json")
      ? await response.json()
      : { message: response.statusText };

    if (response.status === 201) {
      messageDiv.textContent = `Student created successfully! ID: ${responseBody.id}`;
      messageDiv.style.color = "green";
      createStudentForm.reset(); // Clear form on success
      console.log("Created Student:", responseBody);
    } else if (response.status === 400) {
      // Validation error
      messageDiv.textContent = `Validation Error: ${responseBody.message}`;
      messageDiv.style.color = "red";
      console.error("Validation Error:", responseBody);
    } else {
      // Other errors
      throw new Error(
        `API error! status: ${response.status}, message: ${responseBody.message}`
      );
    }
  } catch (error) {
    console.error("Error creating student:", error);
    messageDiv.textContent = `Failed to create student: ${error.message}`;
    messageDiv.style.color = "red";
  }
});
