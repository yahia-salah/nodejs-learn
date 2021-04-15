const Logger = require('./logger');
const logger = new Logger();

logger.on('messageLogged', (arg) => {
    console.log('Message Logged:', arg);
});

logger.log('Some text message!');