const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { redirect } = require("express/lib/response");
const { dirname } = require("path");
var _ = require('lodash');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// To Store Stories
var posts = [];

app.set("view-engine", "ejs");

app.get("/", function (req, res) {
    res.render(__dirname + "/views/home.ejs", {
        currentDate: currentDate,
        posts: posts
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

app.post("/write.ejs", function (req, res) {
    const post = {
        title: req.body.titleName,
        description: req.body.descriptionName
    }

    posts.push(post);
    res.redirect("/");
});

app.get("/:topic", function (req, res) {
    posts.forEach(function (post) {
        if (_.lowerCase(req.params.topic) === _.lowerCase(post.title)) {
            const postTitle = _.lowerCase(post.title);
            const postDescription = _.lowerCase(post.description);

            res.render(__dirname+"/views/post.ejs", {
                postTitle: postTitle,
                postDescription: postDescription
            })
        }
    });
});

app.listen(3000, function () {
    console.log("Server started")
});