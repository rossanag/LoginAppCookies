
// Error handling middleware
const errorMessages = {
    400: 'Bad Request. There are missing or invalid input data',
    401: 'Unauthorized. Verify your credentials and try to login again.',
    403: 'Forbidden. Expiration time of the session.',
};

export const handleError = (err, req, res, next) => {
    const errorMessage = errorMessages[err.statusCode] || 'Internal Server Error';
    console.error(errorMessage, err);
    res.status(err.statusCode || 500).send(errorMessage);
};

