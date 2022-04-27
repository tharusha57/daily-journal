const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { redirect } = require("express/lib/response");
const { dirname } = require("path");
var _ = require('lodash');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dailyDb');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const journalSchema = {
    title: String,
    description: String
}

const Journal = mongoose.model('Journal', journalSchema);

// To Store Stories
var posts = [];

// app.set("view-engine", "ejs");
app.set('view engine', 'ejs');


app.get("/", function (req, res) {
    Journal.find({}, function (err, foundPosts) {
        if (!err) {
            if (foundPosts) {
                res.render(__dirname + "/views/home.ejs", {
                    currentDate: currentDate,
                    posts: foundPosts
                });
            }
        }
    });

});
app.get("/write", function (req, res) {
    res.render(__dirname + "/views/write.ejs");
});
app.get("/about", function (req, res) {
    res.render(__dirname + "/views/about.ejs");
});

// Generate Date
// current timestamp in milliseconds
let ts = Date.now();


let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();

// prints date & time in YYYY-MM-DD format
const currentDate = year + "-" + month + "-" + date;

app.post("/write", function (req, res) {
    const post = {
        title: req.body.titleName,
        description: req.body.descriptionName
    }

    const journal = new Journal({
        title: req.body.titleName,
        description: req.body.descriptionName
    })

    journal.save(function (err) {
        if (!err) {
            posts.push(post);
            res.redirect("/");
        }
    });


});

app.get("/:postId", function (req, res) {

    const postId = req.params.postId;

    Journal.findOne({_id : postId},function(err,foundPost){
        if(!err){
            res.render("post" , {
                postTitle : foundPost.title,
                postDescription : foundPost.description
            })
        }
    })
});

app.listen(3000, function () {
    console.log("Server started")
});