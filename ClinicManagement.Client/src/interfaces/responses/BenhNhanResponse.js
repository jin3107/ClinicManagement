/**
 * @typedef {Object} BenhNhanResponse
 * @property {string} maBN
 * @property {string} hoTen
 * @property {string|Date} ngaySinh
 * @property {boolean} gioiTinh
 * @property {string} soDienThoai
 * @property {string} diaChi
 * @property {string} soBHYT
 * @property {string} tienSuDiUng
 */

export const createBenhNhanResponse = (
  maBN = "",
  hoTen = "",
  ngaySinh = null,
  gioiTinh = false,
  soDienThoai = "",
  diaChi = "",
  soBHYT = "",
  tienSuDiUng = "",
) => ({
  maBN,
  hoTen,
  ngaySinh,
  gioiTinh,
  soDienThoai,
  diaChi,
  soBHYT,
  tienSuDiUng,
});
