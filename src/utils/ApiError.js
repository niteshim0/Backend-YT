/**
 * Custom API Error class.
 */
class ApiError extends Error {
  /**

   * @param {number} statusCode - HTTP status code for the error.
   * @param {string} message - Error message (default: "Something went wrong").
   * @param {Array} errors - Array of detailed error information (default: []).
   * @param {string} stack - Stack trace for the error (default: "").
   */
  constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
    super(message);

    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false; 
    this.errors = errors;


    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
