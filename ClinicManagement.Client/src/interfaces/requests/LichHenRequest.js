/**
 * @typedef {Object} LichHenRequest
 * @property {string} maLH
 * @property {string|Date} thoiGianKham
 * @property {string} trangThai
 * @property {string} maBN
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

export const createLichHenRequest = (
  maLH = "",
  thoiGianKham = null,
  trangThai = "",
  maBN = null,
  maBS = null,
) => {
  const request = {
    thoiGianKham: toRequestDateTime(thoiGianKham),
    trangThai,
    maBN,
    maBS,
  };
  if (maLH) request.maLH = maLH;
  return request;
};
