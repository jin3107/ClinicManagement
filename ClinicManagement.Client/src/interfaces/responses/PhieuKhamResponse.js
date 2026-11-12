/**
 * @typedef {Object} PhieuKhamResponse
 * @property {string} maPK
 * @property {string|Date} ngayKham
 * @property {string} trieuChung
 * @property {string} chuanDoan
 * @property {string} huongDieuTri
 * @property {string} trangThaiTiepNhan
 * @property {string} maLH
 * @property {string} maBS
 * @property {string} tenBacSi
 * @property {string} tenBenhNhan
 */

export const createPhieuKhamResponse = (
  maPK = "",
  ngayKham = null,
  trieuChung = "",
  chuanDoan = "",
  huongDieuTri = "",
  trangThaiTiepNhan = "",
  maLH = null,
  maBS = null,
  tenBacSi = "",
  tenBenhNhan = "",
) => ({
  maPK,
  ngayKham,
  trieuChung,
  chuanDoan,
  huongDieuTri,
  trangThaiTiepNhan,
  maLH,
  maBS,
  tenBacSi,
  tenBenhNhan,
});
