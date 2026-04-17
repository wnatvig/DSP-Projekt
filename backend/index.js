//imports
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { append } = require("express/lib/response");
const res = require("express/lib/response");

const server = express();
server.use(cors()); //för att kunna ta requests
server.use(express.json()); //för att kunna läsa json data

const db = mysql.createConnection(
    {
            host: 'localhost',
            port: 3307,
            user: 'admin',
            password: 'evavonbahr123',
            database: 'unilink'
    }
);

db.connect((err)=>{
    if(err){
        console.error("Connection failed:", err)
        return;
    }
    console.log("Connected to database Unilink") 
    }
);


function createUser(user){
    const query = 'INSERT INTO users (user_id, first_name, last_name, email, gender) VALUES (?,?,?,?,?)'; 
    db.query(query, [user.first_name, user.last_name, user.email, user.gender], 
        (err, result)=>{
            if(err){
                console.error(err);
                return;
            }
            console.log("User created:", result.insertId);
        } 
    );
}
server.post("/users/create", (req, res) =>{
    createUser(req.body)
    res.json({message: "user created"});
    } 
)

// createUser({
//   user_id:
//   first_name: 'testnisse123',
//   last_name: 'Ulfsson',
//   email: 'ulfulfsson@ulfsson.com',
//   gender: 'AlphaMale'
// });

