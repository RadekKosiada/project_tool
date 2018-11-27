const knox = require('knox');
const fs = require('fs');
let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // secrets.json is in .gitignore
}
const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    //change the name of the bucket.. unique for the whole amazon, no funny characters no dots!!
    // just letters and numbers;
    bucket: 'kosiada-portfolio'
});

exports.upload =function(req, res, next) {
    // console.log('REQ FILE: ', req.file);
    if(!req.file) {
        return res.sendStatus(500);
    }
    const s3Request = client.put(req.file.filename, {
        //required, when AWS serves the file
        'Content-Type': req.file.mimetype,
        'Content-Length': req.file.size,
        'x-amz-acl': 'public-read'
    });

    const readStream = fs.createReadStream(req.file.path);
    // console.log("REQ FILE PATH: ", req.file.path)
    readStream.pipe(s3Request);
    s3Request.on('response', s3Response => {
        console.log(s3Response.statusCode);
        if (s3Response.statusCode == 200){
            next();
        } else {
            res.sendStatus(500);
        }
        fs.unlink(req.file.path, ()=>{});
        // res.json({
        // }
        // success: wasSuccessful
    });

// });
};
