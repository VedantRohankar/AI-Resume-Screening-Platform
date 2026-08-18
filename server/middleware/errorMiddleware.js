export const errorMiddleware = async (err,req,res,next) => {
  //If the error has a statusCode
  const statusCode = err.statusCode || 500;

  // Use the error message, or a generic one for unexpected 500 errors.
    const message = err.message || "Internal Server Error";

    console.error(`[Error] Status: ${statusCode} | Message: ${message}`);

    res.status(statusCode).json({
    success: false,
    message: message,
  });
    
}