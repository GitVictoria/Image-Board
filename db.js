var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:postgres:postgres@localhost:5432/imageBoard");

exports.getImages = () => {
    return db.query(
        `SELECT url, title
        FROM images`
    );
};

exports.storeImages = (title, description, url, username) => {
    return db.query(
        `INSERT INTO images (title, description, url, username)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [title, description, url, username]
    );
};
