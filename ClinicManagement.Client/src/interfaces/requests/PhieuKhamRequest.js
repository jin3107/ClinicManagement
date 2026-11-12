/**
 * @typedef {Object} PhieuKhamRequest
 * @property {string} maPK
 * @property {string|Date} ngayKham
 * @property {string} trieuChung
 * @property {string} chuanDoan
 * @property {string} huongDieuTri
 * @property {string} trangThaiTiepNhan
 * @property {string} maLH
 * @property {string} maBS
 */

const toRequestDateTime = (value) => {
  if (!(value instanceof Date)) return value;
  const pad = (part) => String(part).padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(
    value.getDate(),
  )}T${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(
    value.getSeconds(),
  )}`;
};

export const createPhieuKhamRequest = (
  maPK = "",
  ngayKham = null,
  trieuChung = "",
  chuanDoan = "",
  huongDieuTri = "",
  trangThaiTiepNhan = "",
  maLH = null,
  maBS = null,
) => {
  const request = {
    ngayKham: toRequestDateTime(ngayKham),
    trieuChung,
    chuanDoan,
    huongDieuTri,
    trangThaiTiepNhan,
    maLH,
    maBS,
  };
  if (maPK) request.maPK = maPK;
  return request;
};
