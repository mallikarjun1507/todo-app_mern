const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Root",  // Change if needed
  multipleStatements: true, // Allows multiple SQL queries
};

// Create a connection to MySQL **without selecting a database first**
const dataBase = mysql.createConnection(dbConfig);

dataBase.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL successfully.");

  // Step 1: Create the database if it doesn't exist
  dataBase.query("CREATE DATABASE IF NOT EXISTS todo_app", (err) => {
    if (err) throw err;
    console.log("Database created or already exists.");

    // Step 2: Change to the newly created database
    dataBase.changeUser({ database: "todo_app" }, (err) => {
      if (err) throw err;
      console.log("Using database: todo_app");

      // Step 3: Create the 'tasks' table if it doesn't exist
      const createTableQuery = `CREATE TABLE IF NOT EXISTS tasks (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          completed BOOLEAN DEFAULT FALSE
      )`;

      dataBase.query(createTableQuery, (err) => {
        if (err) throw err;
        console.log("Tasks table created or already exists.");
      });
    });
  });
});

// ✅ Get all tasks
app.get("/tasks", (req, res) => {
  const sql = "SELECT * FROM tasks";
  dataBase.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ✅ Add a new task
app.post("/tasks", (req, res) => {
  const { title, completed = false } = req.body;
  const sql = "INSERT INTO tasks (title, completed) VALUES (?, ?)";
  dataBase.query(sql, [title, completed], (err, result) => {
    if (err) {
      console.error("Error inserting task:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ id: result.insertId, title, completed });
  });
});

// ✅ Update a task
app.put("/tasks/:id", (req, res) => {
  const { title, completed } = req.body;
  const { id } = req.params;

  if (title === undefined || completed === undefined) {
    return res.status(400).json({ error: "Title and completed status are required" });
  }

  const sql = "UPDATE tasks SET title = ?, completed = ? WHERE id = ?";
  dataBase.query(sql, [title, completed, id], (err, result) => {
    if (err) {
      console.error("Error updating task:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task updated successfully" });
  });
});

// ✅ Delete a task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tasks WHERE id = ?";

  dataBase.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting task:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
