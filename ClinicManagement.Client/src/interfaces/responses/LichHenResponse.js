/**
 * @typedef {Object} LichHenResponse
 * @property {string} maLH
 * @property {string|Date} thoiGianKham
 * @property {string} trangThai
 * @property {string} maBN
 * @property {string} maBS
 */

export const createLichHenResponse = (
  maLH = "",
  thoiGianKham = null,
  trangThai = "",
  maBN = null,
  maBS = null,
) => ({
  maLH,
  thoiGianKham,
  trangThai,
  maBN,
  maBS,
});
