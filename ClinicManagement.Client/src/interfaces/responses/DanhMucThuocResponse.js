/**
 * @typedef {Object} DanhMucThuocResponse
 * @property {string} maThuoc
 * @property {string} tenThuoc
 * @property {number} donGia
 * @property {string} chongChiDinh
 */

export const createDanhMucThuocResponse = (
  maThuoc = "",
  tenThuoc = "",
  donGia = 0,
  chongChiDinh = "",
) => ({
  maThuoc,
  tenThuoc,
  donGia,
  chongChiDinh,
});
