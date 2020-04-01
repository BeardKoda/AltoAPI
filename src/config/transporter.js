const nodeMailer = require('nodemailer')
const { MAIL } = require("./app")
options ={
    host: MAIL.HOST || 'mail.privateemail.com',
    port: MAIL.PORT|| 465,
    secure: true,
    auth: {
        // should be replaced with real sender's account
        user: MAIL.USER || 'contact@brindocorp.co',
        pass: MAIL.PASS || 'Josuha@332512'
    }
}
const transporter = nodeMailer.createTransport(options)
module.exports = transporter
