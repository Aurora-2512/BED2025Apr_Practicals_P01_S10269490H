const userModel = require("../models/userModel")

//Get all users
async function getAllUsers(req,res) {
    try  {
        const users = await userModel.getAllUsers();
        res.json(users);
    }
    catch (error) {
        console.error("Controller error: ",error);
        res.status(500).json({error: "Error retrieving users"})
    }
}

//Get User by ID
async function getUserById(req,res){
    try{
        const id=parseInt(req.params.id);
        if(isNaN(id)){
            return res.status(400).json({error: "Invalid user ID"});
        }
        const user = await userModel.getUserById(id);
        if(!user){
            return res.status(404).json({ error: "Student not found" });
        }
        res.json(user);
    }catch(error) {
        console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving user" });
    }
}

//Create new User
async function addUser(req,res) {
    try{
        const newUser = await userModel.addstudent(req.body);
        res.status(201).json(newUser);
    }catch(error) {
        console.error("Controller error:", error);
        res.status(500).json({ error: "Error creating user" }); 
    }
}

//Update
async function updateUser(req,res) {
    try{
        const id= parseInt(req.params.id);
        const updatedData =req.body;
        const result = await studentModel.updateUser(id,updatedData);

        if (result.rowsAffected[0]===0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully" });
    } catch (error){
        console.error("Controller error:", error);
        res.status(500).json({ error: "Error updating user" });
    }
}

async function deleteUser(req,res){
    try{
        const id = parseInt(req.params.id);
        const result = await userModel.deleteUser(id);
        if (result.rowsAffected[0]===0){
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ error: "Error deleting student" });
    }
}

async function searchUsers(req, res) {
  const searchTerm = req.query.searchTerm; // Extract search term from query params

  if (!searchTerm) {
    return res.status(400).json({ message: "Search term is required" });
  }

  try {
    const users = await userModel.searchUsers(searchTerm);
    res.json(users);
  } catch (error) {
    console.error("Controller error in searchUsers:", error);
    res.status(500).json({ message: "Error searching users" });
  }
}
async function getUsersWithBooks(req, res) {
  try {
    const users = await userModel.getUsersWithBooks();
    res.json(users);
  } catch (error) {
    console.error("Controller error in getUsersWithBooks:", error);
    res.status(500).json({ message: "Error fetching users with books" });
  }
}

module.exports={
 getAllUsers,
 getUserById,
 addUser,
 updateUser,
 deleteUser,
 searchUsers,
 getUsersWithBooks
}