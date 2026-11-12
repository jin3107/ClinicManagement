/**
 * @typedef {Object} DanhMucDichVu
 * @property {string} maDV
 * @property {string} tenDV
 * @property {number} donGia
 */

export const createDanhMucDichVu = (
  maDV = "",
  tenDV = "",
  donGia = 0,
) => ({
  maDV,
  tenDV,
  donGia,
});

export const normalizeDanhMucDichVu = (item) => ({
  maDV: item?.maDV ?? item?.MaDV ?? "",
  tenDV: item?.tenDV ?? item?.TenDV ?? "",
  donGia: item?.donGia ?? item?.DonGia ?? 0,
});
