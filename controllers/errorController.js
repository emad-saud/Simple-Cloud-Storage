const sendError = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // API
    return res.status(err.statusCode).json({
      status: err.status,
      // error: err,
      message: err.message,
      // stack: err.stack,
    });
  }

  // console.log('Error 💥', err);
  // RENDERED WEBSITE
  res.status(500).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  sendError(err, req, res);
};
