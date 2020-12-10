let express = require("express"),
    mongoose = require("mongoose"),
    bodyparser = require("body-parser"),
    methodOverride = require("method-override"),
    app = express();

//  App Configuration
//  --------------------------------------------------

app.use(bodyparser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
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
    res.redirect("/blogs");
});

// INDEX - list all blogs at home page route
app.get("/blogs", function (req, res) {

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
app.post("/blogs", function (req, res) {

    //  Retrieve request parameters
    let newBlog = {
        name: req.body.blog.name,
        imageUrl: req.body.blog.imageUrl,
        description: req.body.blog.description,
        created: Date.now()
    };

    //  Add new item to blogs collection
    Blog.create(newBlog, function (err, blog) {
        if (err) console.log(err);
        else {
            // console.log("New Blog Added.\n" + blog);
            //  Redirect to /blogs
            res.redirect("/blogs");
        }
    });

});

//  NEW - form for creating new blog post
app.get("/blogs/new", function (req, res) {
    res.render("new");
});

//  SHOW - display particular blog by id
app.get("/blogs/:id", function (req, res) {

    //  Find blog by id from DB
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            console.log(err);
            return;
        }
        //  Render the foundBlog fetched from DB
        res.render("show", {blog: foundBlog});
    });

});

//  EDIT - edit form for particular blog by id
app.get("/blogs/:id/edit", function (req, res) {

    //  Find blog by id from DB
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            console.log(err);
            return;
        }
        //  Render the foundBlog fetched from DB
        res.render("edit", {blog: foundBlog});
    });

});

//  UPDATE - update blog for particular id
app.put("/blogs/:id", function (req, res) {

    //  Retrieve request parameters
    let newBlog = {
        name: req.body.blog.name,
        imageUrl: req.body.blog.imageUrl,
        description: req.body.blog.description,
        // created: Date.now()
    };

    //  Add new item to blogs collection
    Blog.findByIdAndUpdate(req.params.id, newBlog, function (err, updatedBlog) {
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            // console.log("Blog Updated.\n" + updatedBlog);
            //  Redirect to /blogs
            res.redirect("/blogs/" + req.params.id);
        }
    });

});

//  DELETE - delete blog for particular id
app.delete("/blogs/:id", function (req, res) {

    //  Add new item to blogs collection
    Blog.findByIdAndRemove(req.params.id, function (err, deletedBlog) {
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            console.log("Blog Deleted: " + deletedBlog);
            //  Redirect to /blogs
            res.redirect("/blogs");
        }
    });

});

//  Boot the Server
app.listen(3000, function () {
    console.log("Server Booted..!! [Port#3000]");
});

