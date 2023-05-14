const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require('dotenv').config()
// console.log(process.env);

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Run main function and catch error
main().catch((err) => console.log(err));
async function main() {
  //localhost ain't working because in config it's binding to 127.0.0.1 
  const url = "mongodb+srv://"+ process.env.Password +"@cluster0.wystzfy.mongodb.net/listDB"; 
  await mongoose.connect(url, {
    useNewUrlParser: true,
  });

  const itemsSchema = new mongoose.Schema({
    name: String
  });

  const item = mongoose.model("item", itemsSchema );
  const item1 = new item({
    name: "Code"
  });
 

const li = [item1];
  
app.get("/", function (req, res) {
  var today = new Date();
  var options = {
    weekday: "long",
    day:"numeric",
    month:"long"
  }
  item.find().then((items) => {
    if(items.length===0){
      item.insertMany(li).then(function () {
        console.log("Successfully saved defult items to DB");
      })
      .catch(function (err) {
        console.log(err);
      });
      res.redirect("/");
    }
    else{
      var day = today.toLocaleDateString("en-US",options);
      res.render("list",{kindofday: day,newlist: items});
    }
    
}).catch(err => {
   console.log(err);
});
});

app.get("/example", function (req, res) {
    res.render("example");
});

app.post("/example", function (req, res) {
    res.redirect("/example");
});

app.post("/createItem", function (req, res) {
    const newitem = req.body.item;
    const it = new item({
      name: newitem
    });
    it.save();
    res.redirect("/");
});

app.post("/deleteItem", async (req, res) => {
  console.log(req.body.button);
  await item.deleteOne({ _id: req.body.button});

  res.redirect("/");
})

app.listen(3000 || process.env.PORT, function () {
  console.log("Server is running on port 3000");
});
}