// middleware/errorHandler.js

function errorHandler(err, req, res, next) {
  console.error('ErrorHandler:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack:', err.stack);
  }

  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
}

module.exports = errorHandler;
