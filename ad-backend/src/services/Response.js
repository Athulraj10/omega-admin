module.exports = {
    successResponseData(res, data, code = 200, message, extras) {
        const response = {
            data,
            meta: {
                code,
                message
            }
        };
        if (extras) {
            Object.keys(extras).forEach((key) => {
                if ({}.hasOwnProperty.call(extras, key)) {
                    response.meta[key] = extras[key];
                }
            });
        }
        return res.status(code).send(response);
    },
    successResponseWithData(res, data, message, statusCode) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    },
    successResponseWithoutData(res, message, code = 200) {
        const response = {
            meta: {
                code,
                message
            }
        };
        return res.status(code).send(response);
    },

    errorResponseWithoutData(res, message, code = 0) {
        const response = {
            data: null,
            meta: {
                code,
                message
            }
        };
        return res.status(code).send(response);
    },

    errorResponseData(res, message, code = 400) {
        const response = {
            code,
            message
        };
        return res.status(code)
            .send(response);
    },

    validationErrorResponseData(res, message, code = 400) {
        const response = {
            code,
            message
        };
        return res.status(code)
            .send(response);
    }
};
