/**
 * @typedef {Object} RegisterRequest
 * @property {string} name
 * @property {string} email
 * @property {string} phoneNumber
 * @property {string} password
 * @property {string} confirmPassword
 */
export const createRegisterRequest = (
    name = "",
    email = "",
    phoneNumber = "",
    password = null,
    confirmPassword = null
) => ({
    name,
    email,
    phoneNumber,
    password: password || null,
    confirmPassword: confirmPassword || null,
});