module.exports = class ClientError extends Error {
  constructor(systemMessage, userMessage, httpStatus) {
    super(systemMessage);
    this.userMessage = userMessage;
    this.httpStatus = httpStatus;
  }
};
