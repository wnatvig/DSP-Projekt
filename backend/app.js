const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const usersRoute = require("./routes/users");
const eventRoute = require ("./routes/events");
app.use("/users", usersRoute);
app.use("/events", eventRoute);

app.listen(3000, ()=>{
    console.log("server running on port 3000");
});