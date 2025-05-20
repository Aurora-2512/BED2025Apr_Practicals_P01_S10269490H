const apiBaseUrl = "http://localhost:3000";
const bookDetailsDiv = document.getElementById("bookDetails");

// Helper to get query parameter by name
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Fetch and display book details
async function fetchBookDetails(bookId) {
  try {
    const response = await fetch(`${apiBaseUrl}/books/${bookId}`);
    if (!response.ok) throw new Error(`Book not found (status: ${response.status})`);

    const book = await response.json();
    bookDetailsDiv.innerHTML = `
      <h2>${book.title}</h2>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>ID:</strong> ${book.id}</p>
    `;
  } catch (error) {
    bookDetailsDiv.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
  }
}

// Back button function
function goBack() {
  window.location.href = "index.html";
}

// On page load
const bookId = getQueryParam("id");
if (bookId) {
  fetchBookDetails(bookId);
} else {
  bookDetailsDiv.innerHTML = `<p style="color:red;">No book ID provided in the URL.</p>`;
}
