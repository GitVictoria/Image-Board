const express = require("express");
const app = express();
const db = require("./db");

const ca = require("chalk-animation");

app.use(express.static("./public"));

app.get("/images", (req, res) => {
    db.getImages().then(results => {
        console.log("Results: ", results);
        res.json(results.rows);
    });
});

app.listen(8080, () => ca.rainbow("Listening, let's GO!"));
