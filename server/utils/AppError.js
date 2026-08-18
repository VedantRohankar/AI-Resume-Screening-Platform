class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // Captures the stack trace so you know exactly which file caused the error
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;