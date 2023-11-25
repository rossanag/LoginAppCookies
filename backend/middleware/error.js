
// Error handling middleware
const errorMessages = {
    400: 'Bad Request. There are missing or invalid input data',
    401: 'Unauthorized. Verify your credentials and try to login again.',
    403: 'Forbidden. Expiration time of the session.',
    500: 'Please, try again later.' // Internal Server Error
};

export const handleError = (err, req, res, next) => {
    const errorMessage = errorMessages[err.statusCode] || 'Please, try again later.';
    console.error(errorMessage, err);
    if (err.status === 401) {
        res.clearCookie('refreshToken', { httpOnly: true });
    }
    res.status(err.status || 500).send(errorMessage);
};

