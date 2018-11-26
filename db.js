var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:postgres:postgres@localhost:5432/imageBoard");

exports.getImages = () => {
    return db.query(
        `SELECT *
        FROM images
        ORDER BY id DESC
        LIMIT 6`
    );
};

exports.delete = id => {
    return db.query(
        `DELETE FROM images
        WHERE id = $1`,
        [id]
    );
};

exports.deleteComments = image_id => {
    return db.query(
        `DELETE FROM comments
        WHERE image_id = $1`,
        [image_id]
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

exports.storeComment = (image_id, username, comment) => {
    return db.query(
        `INSERT INTO comments (image_id, username, comment)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [image_id, username, comment]
    );
};

exports.getComment = id => {
    return db.query(
        `SELECT username, comment, published_at
        FROM comments
        WHERE image_id = $1
        ORDER BY published_at DESC`,
        [id]
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
