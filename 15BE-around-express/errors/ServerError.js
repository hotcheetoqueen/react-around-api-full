class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = ServerError;

// app.use((err, req, res, next) => {
//   // if an error has no status, display 500
//   const { statusCode = 500, message } = err;
//   res
//     .status(statusCode)
//     .send({
//       // check the status and display a message based on it
//       message: statusCode === 500
//         ? 'An error occurred on the server'
//         : message
//     });
// });
