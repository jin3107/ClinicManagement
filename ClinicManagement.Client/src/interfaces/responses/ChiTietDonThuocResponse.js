/**
 * @typedef {Object} ChiTietDonThuocResponse
 * @property {string} maCTDT
 * @property {string} maThuoc
 * @property {string} tenThuoc
 * @property {number} donGia
 * @property {number} soLuong
 * @property {string} lieuDung
 */

export const createChiTietDonThuocResponse = (
  maCTDT = "",
  maThuoc = "",
  tenThuoc = "",
  donGia = 0,
  soLuong = 0,
  lieuDung = "",
) => ({
  maCTDT,
  maThuoc,
  tenThuoc,
  donGia,
  soLuong,
  lieuDung,
});
