/**
 * @typedef {Object} SendOtpRequest
 * @property {string} email
 */
export const createSendOtpRequest = (email = "") => ({
  email,
});
