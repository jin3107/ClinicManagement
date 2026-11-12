/**
 * @typedef {Object} DanhMucThuocRequest
 * @property {string} maThuoc - Medicine ID (for updates)
 * @property {string} tenThuoc
 * @property {number} donGia
 * @property {string} chongChiDinh
 */
export const createDanhMucThuocRequest = (
  maThuoc = "",
  tenThuoc = "",
  donGia = 0,
  chongChiDinh = null,
) => {
  const request = {
    tenThuoc,
    donGia,
    chongChiDinh: chongChiDinh || null,
  };
  if (maThuoc) request.maThuoc = maThuoc;
  return request;
};
