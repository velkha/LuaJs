// controllers/ErrorHandler.js
class ErrorHandler {
    static handle(error, message) {
        console.error(error);
        message.reply('An error occurred while executing this command.');
    }
}

module.exports = ErrorHandler;