class HttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "Error";
        this.statusCode = statusCode;
    }
}

class GenericHttpError extends HttpError {
    constructor(message) {
        super(message, 400);
    }
}

class NotFoundError extends HttpError {
    constructor(message) {
        super(message, 404);
        this.name = "NotFoundError";
    }
}

class BadRequestError extends HttpError {
    constructor(message) {
        super(message, 400);
        this.name = "BadRequestError";
    }
}

class UnauthorizedError extends HttpError {
    constructor(message) {
        super(message, 401);
        this.name = "UnauthorizedError";
    }
}

class ForbiddenError extends HttpError {
    constructor(message) {
        super(message, 403);
        this.name = "ForbiddenError";
    }
}

class ConflictError extends HttpError {
    constructor(message) {
        super(message, 409);
        this.name = "ConflictError";
    }
}

class InternalServerError extends HttpError {
    constructor(message) {
        super(message, 500);
        this.name = "InternalServerError";
    }
}

class ServiceUnavailableError extends HttpError {
    constructor(message) {
        super(message, 503);
        this.name = "ServiceUnavailableError";
    }
}

module.exports = {
    HttpError,
    GenericHttpError: GenericHttpError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    InternalServerError,
    ServiceUnavailableError,
};
