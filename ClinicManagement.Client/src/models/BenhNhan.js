/**
 * @typedef {Object} BenhNhan
 * @property {string} maBN
 * @property {string} hoTen
 * @property {string|Date} ngaySinh
 * @property {boolean} gioiTinh
 * @property {string} soDienThoai
 * @property {string} diaChi
 * @property {string} soBHYT
 * @property {string} tienSuDiUng
 */

export const createBenhNhan = (
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

export const normalizeBenhNhan = (item) => ({
  maBN: item?.maBN ?? item?.MaBN ?? "",
  hoTen: item?.hoTen ?? item?.HoTen ?? "",
  ngaySinh: item?.ngaySinh ?? item?.NgaySinh ?? null,
  gioiTinh: item?.gioiTinh ?? item?.GioiTinh ?? false,
  soDienThoai: item?.soDienThoai ?? item?.SoDienThoai ?? "",
  diaChi: item?.diaChi ?? item?.DiaChi ?? "",
  soBHYT: item?.soBHYT ?? item?.SoBHYT ?? "",
  tienSuDiUng: item?.tienSuDiUng ?? item?.TienSuDiUng ?? "",
});
