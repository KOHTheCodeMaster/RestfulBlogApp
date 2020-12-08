let express = require("express"),
    mongoose = require("mongoose"),
    bodyparser = require("body-parser"),
    app = express();

//  App Configuration
//  --------------------------------------------------

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


//  Setup MongoDB Database
//  --------------------------------------------------

//  Establish Connection with DB
mongoose.connect("mongodb://localhost:27017/RestfulBlogApp", function (err) {
    if (err) console.log(err);
    else console.log("Connection To MongoDB Established successfully.");
});

//  Define Blog Schema
let blogSchema = mongoose.Schema(
    {
        name: String,
        imageUrl: String,
        description: String,
        created: {type: Date, default: Date.now()}
    }
);

//  Define Blog Model (Collection)
let Blog = mongoose.model("Blog", blogSchema);


//  Setup Routes
//  --------------------------------------------------

//  Home page route
app.get("/", function (req, res) {
    res.redirect("/index");
});

// INDEX - blogs index page route
app.get("/index", function (req, res) {

    //  Find all the blogs from DB
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log(err);
            return;
        }
        //  Render all the blogs fetched from DB
        res.render("index", {blogs: blogs});
    });

});

//  CREATE - blogs post page route
app.post("/index", function (req, res) {

    //  Retrieve request parameters
    let newBlog = {
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        created: Date.now()
    };

    //  Add new item to blogs collection
    Blog.create(newBlog, function (err, blog) {
        if (err) console.log(err);
        else {
            console.log("New Blog Added.\n" + blog);
            //  Redirect to /index
            res.redirect("index");
        }
    });

});


//  Boot the Server
app.listen(3000, function () {
    console.log("Server Booted..!! [Port#3000]");
});

