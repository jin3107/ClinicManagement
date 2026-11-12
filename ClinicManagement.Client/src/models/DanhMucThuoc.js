/**
 * @typedef {Object} DanhMucThuoc
 * @property {string} maThuoc
 * @property {string} tenThuoc
 * @property {number} donGia
 * @property {string} chongChiDinh
 */

export const createDanhMucThuoc = (
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

export const normalizeDanhMucThuoc = (item) => ({
  maThuoc: item?.maThuoc ?? item?.MaThuoc ?? "",
  tenThuoc: item?.tenThuoc ?? item?.TenThuoc ?? "",
  donGia: item?.donGia ?? item?.DonGia ?? 0,
  chongChiDinh: item?.chongChiDinh ?? item?.ChongChiDinh ?? "",
});
