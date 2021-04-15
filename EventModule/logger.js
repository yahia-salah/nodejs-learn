const EventEmitter = require('events');

class Logger extends EventEmitter {
    log(message) {
        console.log('Message:', message);
        this.emit('messageLogged', { id: 1, text: message });
    }
}

global.module.exports=Logger;