/**
 * @typedef {Object} DanhMucDichVuRequest
 * @property {string} maDV - Service ID (for updates)
 * @property {string} tenDV
 * @property {number} donGia
 */
export const createDanhMucDichVuRequest = (
  maDV = "",
  tenDV = "",
  donGia = 0,
) => {
  const request = {
    tenDV,
    donGia,
  };
  if (maDV) request.maDV = maDV;
  return request;
};
