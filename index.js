
const express = require("express");
const mongoose = require("mongoose");
const File = require("./models/File");
const app = express();
const port = process.env.PORT || 3000;
mongoose.set("strictQuery", false);
mongoose.connect(process.env['DB_SECRET']);
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static('public'))

app.get("/", (req, res) => {
  res.render("index");
});


app.get("/update", async (req, res) => {
  try {
    let file = await File.findOne();
    file.count++
    await file.save();
    let file1 = await File.find();
    res.json(file1);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating count" });
  }
});

app.get("/get", async (req, res) => {
  const data = await File.find();
  res.json(data)

});



app.listen(port, (e) => {
  if (e) {
    console.log("error is " + e);
  }
  console.log("Started");
});
