/**
 * @typedef {Object} VerifyOtpRequest
 * @property {string} email
 * @property {string} code
 */
export const createVerifyOtpRequest = (email = "", code = "") => ({
  email,
  code,
});
