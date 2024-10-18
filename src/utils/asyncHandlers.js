export const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        // Call the requestHandler and handle both synchronous and asynchronous errors
        Promise.resolve(requestHandler(req, res, next)).catch(next);
    };
};
