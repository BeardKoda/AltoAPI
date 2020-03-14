const  transporter = require('../../../config/transporter')
var { APP_URL, MAIL } = require('../../../config/app')
var hbs = require('nodemailer-express-handlebars');

var options = {
    viewEngine: {
        extName:'.hbs',
        layoutsDir: 'src/views/email/partials/',
        partialsDir: 'src/views/email/partials/',
        defaultLayout : 'layout',
    },
    viewPath: 'src/views/email/'
}

transporter.use('compile', hbs(options));

module.exports = (data) => {
    setImmediate(() => {
        url = APP_URL+"/account/verify/"+data.email_token
        console.log(url)
        let mailOptions = {
            // should be replaced with real recipient's account
            from: MAIL.FROM,
            to: data.email,
            subject: 'Account Verification - AltoStream',
            template:'./verify',
            context: {
                name: data.name||data.username,
                email:data.email,
                url:url
            }
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    });
}