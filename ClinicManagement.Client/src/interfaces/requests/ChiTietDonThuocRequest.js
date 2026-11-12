/**
 * @typedef {Object} ChiTietDonThuocRequest
 * @property {string} maCTDT
 * @property {string} maThuoc
 * @property {number} soLuong
 * @property {string} lieuDung
 */

export const createChiTietDonThuocRequest = (
  maCTDT = "",
  maThuoc = "",
  soLuong = 1,
  lieuDung = "",
) => {
  const request = {
    maThuoc,
    soLuong,
    lieuDung,
  };
  if (maCTDT) request.maCTDT = maCTDT;
  return request;
};
