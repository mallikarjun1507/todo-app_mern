const express = require("express");
const mysql = require("mysql")
const bodyParser = require('body-parser');
const cors = require("cors")

const app = express()
app.use(bodyParser.json())
app.use(cors()) 

const dbConfig ={
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todo_app'
}
const dataBase = mysql.createConnection({dbConfig})

// Function to create the database and tables if they don't exist

const createDataBaseAndTabels = () =>{
  dataBase.connect(err =>{
    if(err){
        console.error('Error connecting: ' + err.stack);
        return;
    }
    dataBase.query('CREATE DATABASE IF NOT EXISTS todo_app', err=>{
      if (err) throw err;
      console.log('Database created or successfully checked.');
      dataBase.config('todo_app')
      dataBase.changeUser({database: dbConfig.database }, err=>{
        if (err) throw err;
        console.log('Using database: ' + dbConfig.database);
        database.query(`CREATE TABLE IF NOT EXISTS tasks(
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          completed BOOLEAN DEFAULT FALSE
        )`,err=>{
          if (err) throw err;
          console.log('Tasks table created or already exists.');
        })
      })

    })
  })
}

createDataBaseAndTabels();
// Get all tasks
app.get('/tasks', (req, res) => {
    let sql = 'SELECT * FROM tasks';
    dataBase.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  
  // Add new task
  app.post('/tasks', (req, res) => {
    let task = { title: req.body.title, completed: req.body.completed };
    let sql = 'INSERT INTO tasks SET ?';
    dataBase.query(sql, task, (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, ...task });
    });
  });
  
  // Update task
  app.put('/tasks/:id', (req, res) => {
    let newTitle = req.body.title;
    let newCompleted = req.body.completed;
    let sql = `UPDATE tasks SET title = '${newTitle}', completed = ${newCompleted} WHERE id = ${req.params.id}`;
    dataBase.query(sql, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });
  
  // Delete task
  app.delete('/tasks/:id', (req, res) => {
    let sql = `DELETE FROM tasks WHERE id = ${req.params.id}`;
    dataBase.query(sql, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });
  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`the server runing on port ${PORT}`))