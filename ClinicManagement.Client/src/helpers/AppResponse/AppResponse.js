/**
 * @typedef {Object} AppResponse
 * @property {boolean} isSuccess - Indicates if the response was successful
 * @property {string} message - Response message
 * @property {any} data - Response data
 */

export const createAppResponse = (data = null, isSuccess = true, message = '') => ({
	isSuccess,
	message,
	data,
});

export const buildSuccessResponse = (data, message = '') =>
	createAppResponse(data, true, message);

export const buildErrorResponse = (message) =>
	createAppResponse(null, false, message);
