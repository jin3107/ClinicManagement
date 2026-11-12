/**
 * @typedef {Object} ProfileResponse
 * @property {string} userName
 * @property {string} role
 */
export const createProfileResponse = (userName = "", role = "") => ({
  userName,
  role,
});

export const normalizeProfileResponse = (item) => ({
  userName: item?.userName ?? item?.UserName ?? "",
  role: item?.role ?? item?.Role ?? "",
});
