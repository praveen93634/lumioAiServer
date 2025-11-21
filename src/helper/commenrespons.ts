export const  response= function(req, res, result, statusCode, message) {
    return res.status(statusCode).json({
        status: statusCode,
        result: result,
        message: message
    });
}



