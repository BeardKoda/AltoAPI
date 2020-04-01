// config.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    APP_NAME:process.env.APP_NAME,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,

    APP_URL: process.env.APP_URL,
    USER_URL: process.env.USER_URL,
    ARTIST_URL: process.env.ARTIST_URL,

    APP_SECRET:process.env.APP_SECRET,

    U_SESS_LIFETIME: process.env.U_SESS_LIFETIME,
    U_SESS_NAME: process.env.U_SESS_NAME,
    U_SESS_SECRET: process.env.U_SESS_SECRET,

    A_SESS_LIFETIME: process.env.A_SESS_LIFETIME,
    A_SESS_NAME: process.env.A_SESS_NAME,
    A_SESS_SECRET: process.env.A_SESS_SECRET,

    S3_ID:process.env.S3_ID,
    S3_SECRET:process.env.S3_SECRET,
    S3_BUCKET:process.env.S3_BUCKET,
    S3_URL:process.env.S3_URL,
    // Email 
    MAIL: {
        USER : process.env.EMAIL_USER,
        PASS : process.env.EMAIL_PASS,
        HOST : process.env.EMAIL_HOST,
        PORT : process.env.EMAIL_PORT,
        FROM : process.env.EMAIL_FROM
    }

};