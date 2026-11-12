/**
 * @typedef {Object} DanhMucDichVuResponse
 * @property {string} maDV
 * @property {string} tenDV
 * @property {number} donGia
 */

export const createDanhMucDichVuResponse = (
  maDV = "",
  tenDV = "",
  donGia = 0,
) => ({
  maDV,
  tenDV,
  donGia,
});
