const startupDebuger = require('debug')('app:startup');
const dbDebuger = require('debug')('app:db');
const express = require('express');
const logger = require('./middleware/logger');
const authenticate = require('./middleware/authenticate');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const courses = require('./routes/courses');
const home = require('./routes/home');
const app = express();

console.log('Config Name:', config.get('name'));
console.log('Config Mail Host:', config.get('mail.host'));
//console.log('Config Mail Password:',config.get('mail.password'));

// Middleware Fucntions //
if (app.get('env') === 'development') { // $env:NODE_ENV="development" in PS
    app.use(morgan('tiny'));
    startupDebuger('Morgan is enabled...'); // $env:DEBUG="app:startup" in PS, set DEBUG=app:startup in CMD
}

// Database code
dbDebuger('This is the database connection initialization...');

app.set('view engine', 'pug');
app.set('views', './views');

app.use(helmet());
app.use(express.json());
app.use(logger);
app.use(authenticate);
app.use('/api/courses', courses);
app.use('/', home);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
