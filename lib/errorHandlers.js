function HttpErrorHandler(err, req, res, next) {
    const errStatus = err.status || 500
    const errMessage = err.message || 'Something went wrong'
    console.log(err)
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMessage,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    })
}

module.exports = HttpErrorHandler