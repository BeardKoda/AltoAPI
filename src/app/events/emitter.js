const EventEmitter =  require('events');
const Emitter = new EventEmitter();

// listeners
    Emitter.on('test', (data)=>{
        console.log(data)
    });
    // Emitter.on('tested',require('./listeners/sendEmail'));
    Emitter.on('sendMail:Register',require('./listeners/sendEmail'));
    Emitter.on('sendMail:Reset',require('./listeners/resetEmail'));

module.exports = Emitter
