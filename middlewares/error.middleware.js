// errorMiddleware.js

// Global error-handling middleware
const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging

  // You can customize status code based on the error type
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorMiddleware;
