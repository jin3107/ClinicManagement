/**
 * @typedef {Object} LichLamViecResponse
 * @property {string} maLLV
 * @property {string|Date} ngayLamViec
 * @property {string|Date} gioBatDau
 * @property {string|Date} gioKetThuc
 * @property {string} maBS
 * @property {string} tenBacSi
 */

export const createLichLamViecResponse = (
  maLLV = "",
  ngayLamViec = null,
  gioBatDau = null,
  gioKetThuc = null,
  maBS = null,
  tenBacSi = "",
) => ({
  maLLV,
  ngayLamViec,
  gioBatDau,
  gioKetThuc,
  maBS,
  tenBacSi,
});
