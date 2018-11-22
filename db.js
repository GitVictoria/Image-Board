var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:postgres:postgres@localhost:5432/imageBoard");

exports.getImages = () => {
    return db.query(
        `SELECT *
        FROM images
        ORDER BY id DESC
        LIMIT 3`
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

exports.getImageById = id => {
    return db.query(
        `SELECT *,
        (SELECT id AS last_id FROM images WHERE id = 1)
        FROM images
        WHERE id = $1`,
        [id]
    );
};

exports.getMoreImages = lastId => {
    return db
        .query(
            `SELECT * FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 3`,
            [lastId]
        )
        .then(results => {
            return results.rows;
        });
};
