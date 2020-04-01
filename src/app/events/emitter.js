const EventEmitter =  require('events');
const Emitter = new EventEmitter();

// listeners
    Emitter.on('test', (data)=>{
        console.log(data)
    });
    // Emitter.on('tested',require('./listeners/sendEmail'));
    Emitter.on('sendMail:Register',require('./listeners/sendEmail'));

module.exports = Emitter
