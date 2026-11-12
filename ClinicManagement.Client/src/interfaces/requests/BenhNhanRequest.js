/**
 * @typedef {Object} BenhNhanRequest
 * @property {string} maBN
 * @property {string} hoTen
 * @property {string|Date} ngaySinh
 * @property {boolean} gioiTinh
 * @property {string} soDienThoai
 * @property {string} diaChi
 * @property {string} soBHYT
 * @property {string} tienSuDiUng
 */

const toRequestDate = (value) => {
  if (!(value instanceof Date)) return value;
  const pad = (part) => String(part).padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(
    value.getDate(),
  )}T00:00:00`;
};

export const createBenhNhanRequest = (
  maBN = "",
  hoTen = "",
  ngaySinh = null,
  gioiTinh = false,
  soDienThoai = "",
  diaChi = "",
  soBHYT = "",
  tienSuDiUng = "",
) => {
  const request = {
    hoTen,
    ngaySinh: toRequestDate(ngaySinh),
    gioiTinh,
    soDienThoai,
    diaChi,
    soBHYT,
    tienSuDiUng,
  };
  if (maBN) request.maBN = maBN;
  return request;
};
