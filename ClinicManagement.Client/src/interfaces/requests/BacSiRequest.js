/**
 * @typedef {Object} BacSiRequest
 * @property {string} maBS - Doctor ID (for updates)
 * @property {string} hoTen - Full name
 * @property {string} chuyenKhoa - Specialty
 * @property {string} soDienThoai - Phone number
 * @property {string} email - Email
 * @property {string} password - Password
 */

export const createBacSiRequest = (
  maBS = "",
  hoTen = "",
  chuyenKhoa = "",
  soDienThoai = "",
  email = "",
  password = null,
) => {
  const request = {
    hoTen,
    chuyenKhoa,
    soDienThoai,
    email,
    password: password || null,
  };

  if (maBS) request.maBS = maBS;
  return request;
};
