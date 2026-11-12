/**
 * @typedef {Object} ResetPasswordRequest
 * @property {string} email
 * @property {string} newPassword
 * @property {string} confirmNewPassword
 */
export const createResetPasswordRequest = (
  email = "",
  newPassword = "",
  confirmNewPassword = "",
) => ({
  email,
  newPassword,
  confirmNewPassword,
});
