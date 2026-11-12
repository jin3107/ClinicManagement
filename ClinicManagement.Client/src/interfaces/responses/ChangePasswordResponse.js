/**
 * @typedef {Object} ChangePasswordResponse
 * @property {string} email
 */
export const createChangePasswordResponse = (email = "") => ({
  email,
});

export const normalizeChangePasswordResponse = (item) => ({
  email: item?.email ?? item?.Email ?? "",
});
