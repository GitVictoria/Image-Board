const express = require("express");
const app = express();
const db = require("./db");
const s3 = require("./s3");
var path = require("path");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// const csurf = require("csurf");

const ca = require("chalk-animation");

app.use(express.static("./public"));
// app.use(express.static("./uploads"));

// app.use(csurf());

// BOILER PLATE TO UPLOAD FILES TO THE SERVER
var multer = require("multer"); // takes image and puts in in uploads
var uidSafe = require("uid-safe");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        // where on my computer this file should be saved
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            // will convert name into 24 character string, makes sure every file has unique name
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152 // max size that user can upload
    }
});

// END OF BOILER PLATE
app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        console.log("req.file is : ", req.file);
        db.storeImages(
            req.body.title,
            req.body.description,
            (req.file.url =
                "https://s3.amazonaws.com/victoria-catnip-imageboards/" +
                req.file.filename), // url from amazon
            req.body.username
        )
            .then(results => {
                res.json({
                    results: results.rows,
                    success: true
                });
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        res.json({
            success: false
        });
    }
});

app.post("/comments", (req, res) => {
    console.log("this is Req.body of comments: ", req.body);
    db.storeComment(req.body.image_id, req.body.comment, req.body.username)
        .then(results => {
            console.log("results in post comments: ", results);
            res.json(results);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/comments", (req, res) => {
    console.log("this is get comments server resp, HEY");
    db.getComment()
        .then(results => {
            res.json(results.rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/images", (req, res) => {
    db.getImages()
        .then(results => {
            res.json(results.rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/images/:id", (req, res) => {
    Promise.all([db.getImageById(req.params.id), db.getComment(req.params.id)])
        .then(results => {
            res.json(results);
            console.log("this server RESPONSE:", results);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/get-more-images/:id", (req, res) => {
    var lastId = req.params.id;
    db.getMoreImages(lastId)
        .then(images => {
            res.json(images);
            console.log("images in get more images: ", images);
        })
        .catch(err => {
            console.log(err);
        });
    console.log("req.params.id: ", req.params.id);
});

app.post("/del/:id", (req, res) => {
    db.deleteComments(req.params.id)
        .then(() => db.delete(req.params.id))
        .then(results => {
            res.json(results);
            console.log("DELETE REQUEST RESULTS ARE: ", results);
        })
        .catch(err => {
            console.log(err);
        });
});

app.listen(8080, () => ca.rainbow("Listening, let's GO!"));
