class ApiError extends Error {
  constructor(
    statusCode = 400,
    message = "Something Went Wrong!",
    errors = null,
    stack = ""
  ) {
    super(message);
    this.name = this.constructor.name;
    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors,
    };
  }
}

export default ApiError;
