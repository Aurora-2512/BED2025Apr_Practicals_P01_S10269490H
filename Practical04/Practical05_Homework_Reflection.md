# 1 Separation of Concerns
MVC
Model: Handles all the database queries including CRUD functionalities. Its abstract rasw SQL queries from the rest of the application.

Controller: Acts as the middleware between model and view. It process incoming HTTP requests, calls the appropriate model function and returns structures responses.

View: Displays data to users and allows interaction through buttons and forms. It communicates with the backend using fetch() to make API request. By separaating the frontend into its own HTML and javascript, the backend can focus only on data logic, not on how data is displayed

# 2 Robustness and Security


In Practical 3, only basic CRUD routes are implement with very little validations and error handling.

In Practical 4, input validations, try/catch handling, status codes and parameterized queries (to prevent SQL injection) are wisely implemented so it became much easier to catch bugs - especially  malformed input or failed updates.

In Practical 5, added real-world interaction, helping expose issue with API usability (e.g., unclear error messages or missing fields).

# 3 Challenges and Problem Solving

Connecting the frontend to the backend in Practical 05. Understanding how to make fetch() requests, handle asynchronous code (async/await), and update the DOM with responses dynamically took some trial and error.
Approached solving:
-Used browser DevTools to inspect errors in the console and network tab.
-Logged backend errors to the console using console.error() in the controller.
-Tested with localhost to check whether it produce correct output or have errors.

# If I were to add A New Feature

Add genre to the model queries.

Update controller functions to accept and validate it.

Update frontend forms and scripts to display/input the new field.

The separation makes each step modular — I only need to touch the relevant layer, not everything at once.

Compared to Practical 03:
In the early stages, all logic was mixed in one place. Adding a new field meant editing multiple parts of the same file, increasing chances of bugs and confusion.

# 4 Experimental Learning

Reading about MVC, validation, and error handling is one thing, but hands-on practice provides:

Refactoring the project in Practical 04 helped me understand how the MVC pattern improves code clarity and makes it easier to test and maintain.

Working with real user interactions in Practical 05 highlighted the value of clear error messages, consistent API responses, and proper error handling on the frontend.

Troubleshooting asynchronous behavior and mismatched API responses gave me hands-on experience and practical understanding that goes beyond what theory or textbooks can provide.

