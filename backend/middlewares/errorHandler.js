const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : err.status || 500;
  if (statusCode === 500) console.error(err);
  res.status(statusCode).json({ message: err.message });
};

export default errorHandler;
