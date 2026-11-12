/**
 * @typedef {Object} LoginResponse
 * @property {string} userName
 * @property {string} email
 * @property {string} phoneNumber
 * @property {string} role
 * @property {string} accessToken
 * @property {string} refreshToken
 */
export const createLoginResponse = (
  userName = "",
  email = "",
  phoneNumber = "",
  role = "",
  accessToken = "",
  refreshToken = "",
) => ({
  userName,
  email,
  phoneNumber,
  role,
  accessToken,
  refreshToken,
});

export const normalizeLoginResponse = (item) => ({
  userName: item?.userName ?? item?.UserName ?? "",
  email: item?.email ?? item?.Email ?? "",
  phoneNumber: item?.phoneNumber ?? item?.PhoneNumber ?? "",
  role: item?.role ?? item?.Role ?? "",
  accessToken: item?.accessToken ?? item?.AccessToken ?? "",
  refreshToken: item?.refreshToken ?? item?.RefreshToken ?? "",
});
