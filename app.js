const express = require('express');
const helmet = require('helmet');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const userRouter = require('./routes/userRoutes');
const fileRouter = require('./routes/fileRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// app.use(helmet());

// Embedd request body in request object
app.use(express.json());

// Accept files in requests
app.use(express.urlencoded({ extended: true }));

// Embedd cookie object in request
app.use(cookieParser());

// sanitize request object from NoSQL injection
app.use(mongoSanitize());

// sanitize request object from XSS attacks
app.use(xss());

app.use('/', viewRouter);
app.use('/api/users', userRouter);
app.use('/api/files', fileRouter);

app.use((req, res, next) => {
  next();
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
