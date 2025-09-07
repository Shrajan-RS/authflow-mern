class ApiResponse {
  constructor(statusCode = 200, message = "Successful", data = null) {
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 300;
    this.message = message;
    this.data = data;
  }

  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
    };
  }
}

export default ApiResponse;
