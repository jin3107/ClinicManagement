/**
 * @typedef {Object} LoginRequest
 * @property {string} userName
 * @property {string} password
 */
export const createLoginRequest = (
    userName = "",
    password = null
) => ({
    userName,
    password: password || null,
});