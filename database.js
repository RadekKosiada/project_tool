const spicedPg = require('spiced-pg');
//this when we create a secret.json with password and stuff, for git ignore
// const { dbUser, dbPassword } = require('./secrets');

let secrets;
let dbUrl;
//if production the first, if development the second db will be activated;
if (process.env.NODE_ENV === 'production') {
    secrets = process.env;
    dbUrl = process.env.DATABASE_URL;
} else {
    secrets = require('./secrets');
    dbUrl = `postgres://${secrets.dbUser}:${secrets.dbPassword}@localhost:5432/projecttool`;
}

const bcrypt = require('bcryptjs');

const db = spicedPg(dbUrl);

module.exports.saveMessage = function(message, user_id) {
    const q = `
    INSERT INTO messages (message, user_id)
    VALUES ($1, $2) RETURNING *
    `;
    const params = [
        message || null,
        user_id || null
    ];
    return db.query(q, params);
};

module.exports.getLastChatMessages =function() {
    const q= `
    SELECT messages.*, users.last, users.first, images.url
    FROM messages
    LEFT JOIN images
    ON images.user_id = messages.user_id
    JOIN users
    ON users.id = messages.user_id
    ORDER BY id DESC LIMIT 10
    `;
    return db.query(q);
};

//change the query as I have two tables!!!!!
module.exports.getOnlineUsersByIds = function(arrayOfIds) {
    const query = `SELECT users.id as user_id,
    first, last, url
    FROM users
    LEFT JOIN images
    ON images.user_id =users.id
    WHERE users.id = ANY($1)
    `;
    return db.query(query, [arrayOfIds]);
};

module.exports.getFriends = function(receiver_id) {
    const q = `
        SELECT users.id, first, last, url, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        LEFT JOIN images
        ON images.user_id = users.id
        `;

    const params = [
        receiver_id || null
    ];
    return db.query(q, params);
};

module.exports.getUsersProfile = function(user_id) {
    console.log(user_id);
    const q = `
    SELECT *, (
        SELECT url
        FROM images
        WHERE user_id = $1
        ORDER BY id DESC
        LIMIT 1
    ) AS url
    FROM users
    WHERE id = $1
    `;
    const params = [user_id || null];
    return db.query(q, params);
};
// https://stackoverflow.com/questions/10145221/how-to-delete-data-from-multiple-tables
module.exports.deleteProfile =function(id){
    const params =[ id||null];
    return Promise.all([
        db.query((`DELETE FROM users WHERE id =$1`),params),
        db.query((`DELETE FROM images WHERE user_id = $1`),params),
        db.query((`DELETE FROM messages WHERE user_id=$1`),params),
        db.query((`DELETE FROM friendships WHERE receiver_id=$1`),params),
        db.query((`DELETE FROM friendships WHERE sender_id=$1`),params),
    ]);
};

module.exports.getAllImages=function(user_id) {
    const q = `
        SELECT * FROM images
        WHERE images.user_id =$1
    `;
    const params =[user_id|| null];
    return db.query(q, params);
};

module.exports.getOtherUsersProfile = function(id) {
    const q = `
        SELECT * FROM users
        WHERE id = $1
    `;
    const params = [ id || null];
    return db.query(q, params);
}

module.exports.getFriendsStatus = function(friend_id, user_id) {
    const q = `
        SELECT * FROM friendships
        WHERE ((receiver_id =$1 AND sender_id =$2)
        OR (receiver_id =$2 AND sender_id =$1))
        `;
    const params= [
        friend_id || null,
        user_id || null
    ];
    return db.query(q, params);
}

module.exports.sendFriendsRequest = function(receiver_id, sender_id) {
    const q = `
        INSERT INTO friendships (receiver_id, sender_id)
        VALUES ($1, $2) RETURNING *
    `;
    const params =[
        receiver_id || null,
        sender_id || null
    ];
    return db.query(q, params);
}

module.exports.cancelFriendsRequest = function(receiver_id, sender_id) {
    const q = `
        DELETE FROM friendships
        WHERE receiver_id =$1
        AND sender_id=$2
    `;
    const params =[
        receiver_id || null,
        sender_id || null
    ];
    return db.query(q, params);
}

module.exports.acceptFriendsRequest = function(sender_id, receiver_id) {
    const q = `
    UPDATE friendships
    SET accepted = 'true'
    WHERE sender_id=$1
    AND receiver_id=$2
    RETURNING accepted
    `;

    const params =[
    sender_id || null,
    receiver_id || null];

    return db.query(q, params);
}

module.exports.uploadImage = function(url, user_id) {
    console.log(user_id);
    const q = `
    INSERT INTO images (url, user_id) VALUES ($1, $2) RETURNING *
    `;
    const params = [
        url || null,
        user_id || null,
    ];
    return db.query(q, params);
}

module.exports.saveBio = function(bio, id) {
    const q = `
    UPDATE users
    SET bio = $1
    WHERE id=$2
    RETURNING bio
    `;
    const params = [
        bio || null,
        id || null
    ];
    return db.query(q, params);
};

module.exports.hashedPassword = function(plainTextPassword) {
    return new Promise(function(res, rej) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return rej(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return rej(err);
                }
                console.log(
                    'plainTextPassword: ', plainTextPassword,
                    'salt: ', salt,
                    'hash: ', hash
                );
                res(hash);
            });
        });
    });
};

module.exports.insertNewUser = function(first, last, email, hashedPw) {
    const q = `
    INSERT INTO users
    (first, last, email, password)
    VALUES
    ($1, $2, $3, $4)
    RETURNING id
    `;

    const params = [
        first || null,
        last || null,
        email || null,
        hashedPw || null
    ];
    console.log("insertNewUser fired!");
    return db.query(q, params);
};

module.exports.getPassword = function(usersEmail) {
    const q = `
    SELECT password, id
    FROM users
    WHERE email = $1
    `;
    const params = [
        usersEmail || null
    ];
    console.log("getPassword fired!");
    return db.query(q, params);
};

module.exports.checkPassword = function(textEnteredInLoginForm, hashedPasswordFromDatabase) {
    return new Promise(function(res, rej) {
        bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function(err, doesMatch) {
            if (err) {
                rej(err);
            } else {
                res(doesMatch);
            }
        });
    });
};

module.exports.saveNewSpace = function(owner_id, name, category) {
    const q = `
    INSERT INTO spaces (owner_id, name, category)
    VALUES ($1, $2, $3) RETURNING *
    `;
    const params = [
        owner_id || null,
        name || null,
        category || null
    ];
    return db.query(q, params);
};

// module.exports.updateSpace = function(user_id, )
