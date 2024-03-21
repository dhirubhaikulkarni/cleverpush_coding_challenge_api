const express = require("express");
const Server = require('socket.io')
const http = require('http');
const bodyParser = require("body-parser");
const dotenv = require('dotenv');

dotenv.config();

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, access_token"
  );
  next();
});

const options = {
  allowEIO3: true,
};
var server = require('https',"http","wss").createServer(app)
const Socket_io = Server(server, options, {
  cors: {
    origin: '*',
  }
});

Socket_io.on('connection', async (socket) => {
  await socket.on('join', (room) => {
    socket.join(room);
  });


});

app.get("/", async (req, res) => {
  try {
    res.status(200).send("Success");
  } catch (error) {
    res.status(500).send("Failed");
  }
});


// Emit event when a task is added
app.post("/addTask", async (req, res) => {
  try {
    Socket_io.to(req.body.tipID).emit('AddTask', { data: req.body });
    res.json("Ok");
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Failed");
  }
});

// Emit event when a task is edited
app.post("/editTask", async (req, res) => {
  console.log("Get editTask Call...")
  try {
    Socket_io.to(req.body.tipID).emit('EditTask', { data: req.body });
    res.json("Ok");
  } catch (error) {
    res.status(500).send("Failed");
  }
});


// Emit event when a task is fetched
app.delete("/deleteTask/:tipID/:ID", async (req, res) => {
  Socket_io.to(req.params.tipID).emit('DeleteTask', { data: req.params.ID });
  res.json("Ok");
});

server.listen(4000, () => console.log(`listening on port 4000...`));

module.exports = app;
