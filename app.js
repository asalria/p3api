require('dotenv').config();
const express = require('express');
var mime = require('mime-types');
const path = require('path');
const favicon = require('serve-favicon');
const moment = require('moment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const cors = require('cors');
const corsConfig = require('./configs/cors.config');

require('./configs/db.config');
require('./configs/passport.config').setup(passport);

const routesRoutes = require('./routes/routes.routes')
const usersRoutes = require('./routes/users.routes');
const sessionRoutes = require('./routes/session.routes');
const messagesRoutes = require('./routes/messages.routes');

const app = express();

app.use(cors(corsConfig))

app.use(logger('dev'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'Super Secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 1000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.session = req.user || {};
  next();
});

// Routes
app.use('/routes', routesRoutes);
app.use('/users', usersRoutes);
app.use('/session', sessionRoutes);
app.use('/messages', messagesRoutes);


// catch 404 and forward to error handler
app.use((req, res, next)  => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ message: error.message || '' });
});

module.exports = app;