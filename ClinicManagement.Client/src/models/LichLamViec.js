/**
 * @typedef {Object} LichLamViec
 * @property {string} maLLV
 * @property {string|Date} ngayLamViec
 * @property {string|Date} gioBatDau
 * @property {string|Date} gioKetThuc
 * @property {string} maBS
 * @property {string} tenBacSi
 */

export const createLichLamViec = (
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

export const normalizeLichLamViec = (item) => ({
  maLLV: item?.maLLV ?? item?.MaLLV ?? "",
  ngayLamViec: item?.ngayLamViec ?? item?.NgayLamViec ?? null,
  gioBatDau: item?.gioBatDau ?? item?.GioBatDau ?? null,
  gioKetThuc: item?.gioKetThuc ?? item?.GioKetThuc ?? null,
  maBS: item?.maBS ?? item?.MaBS ?? null,
  tenBacSi: item?.tenBacSi ?? item?.TenBacSi ?? "",
});
