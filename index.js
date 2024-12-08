const express = require("express");
const bodyParser = require("body-parser");
const employeeRouter = require("./routes/empRoute");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'ListeDesUsers.html'));
});


app.get('/AddOne', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'AddUser.html'));
});

app.get('/Delete', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Del.html'));
});


app.get('/Agg', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Aggregation.html'));
});


mongoose.connect("mongodb://localhost:27017/employeesDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

app.use("/", employeeRouter);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});