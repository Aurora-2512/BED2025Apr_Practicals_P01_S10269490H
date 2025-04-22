const express = require("express");
const app = express();
const PORT = 3000;

// Define route for Welcome Page
app.get("/", (req, res) => {
    res.send("Welcome to Homework API");
});

// Define route for Intro Page
app.get("/intro", (req, res) => {
res.send("Hi, I am Ei Shin Thant from Information Technology. I love biking.");
});  

// Define route for Name Page
app.get("/name", (req, res) => {
res.send("Ei Shin Thant");
}); 

// Define route for hobby Page
app.get("/hobby", (req, res) => {
res.send("Biking");
});

// Define route for food Page
app.get("/food", (req, res) => {
res.send("Tea Leaf Salad");
}); 

// Define route for Hobbies Page
app.get('/hobbies', (req, res) => {
    res.json(["coding", "reading", "cycling"]);
  });

// Define route for student Page
app.get('/student', (req, res) => {
res.json({
    name: "Alex",
    hobbies: ["coding", "reading", "cycling"],
    intro: "Hi, I'm Alex, a Year 2 student passionate about building APIs!"
});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  