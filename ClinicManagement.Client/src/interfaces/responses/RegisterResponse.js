/**
 * @typedef {Object} RegisterResponse
 * @property {string} name
 * @property {string} email
 * @property {string} phoneNumber
 * @property {string} role
 * @property {string} accessToken
 * @property {string} refreshToken
 */
export const createRegisterResponse = (
  name = "",
  email = "",
  phoneNumber = "",
  role = "",
  accessToken = "",
  refreshToken = "",
) => ({
  name,
  email,
  phoneNumber,
  role,
  accessToken,
  refreshToken,
});

export const normalizeRegisterResponse = (item) => ({
  name: item?.name ?? item?.Name ?? "",
  email: item?.email ?? item?.Email ?? "",
  phoneNumber: item?.phoneNumber ?? item?.PhoneNumber ?? "",
  role: item?.role ?? item?.Role ?? "",
  accessToken: item?.accessToken ?? item?.AccessToken ?? "",
  refreshToken: item?.refreshToken ?? item?.RefreshToken ?? "",
});
