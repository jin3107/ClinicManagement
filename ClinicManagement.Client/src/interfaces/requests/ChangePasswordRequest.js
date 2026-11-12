/**
 * @typedef {Object} ChangePasswordRequest
 * @property {string} currentPassword
 * @property {string} newPassword
 * @property {string} confirmNewPassword
 */
export const createChangePasswordRequest = (
    currentPassword = "",
    newPassword = null,
    confirmNewPassword = null
) => ({
    currentPassword,
    newPassword: newPassword || null,
    confirmNewPassword: confirmNewPassword || null,
});
