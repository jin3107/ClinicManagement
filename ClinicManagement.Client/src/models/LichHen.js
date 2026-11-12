/**
 * @typedef {Object} LichHen
 * @property {string} maLH
 * @property {string|Date} thoiGianKham
 * @property {string} trangThai
 * @property {string} maBN
 * @property {string} maBS
 * @property {string} createdBy
 */

export const createLichHen = (
  maLH = "",
  thoiGianKham = null,
  trangThai = "",
  maBN = null,
  maBS = null,
  createdBy = "",
) => ({
  maLH,
  thoiGianKham,
  trangThai,
  maBN,
  maBS,
  createdBy,
});

export const normalizeLichHen = (item) => ({
  maLH: item?.maLH ?? item?.MaLH ?? "",
  thoiGianKham: item?.thoiGianKham ?? item?.ThoiGianKham ?? null,
  trangThai: item?.trangThai ?? item?.TrangThai ?? "",
  maBN: item?.maBN ?? item?.MaBN ?? null,
  maBS: item?.maBS ?? item?.MaBS ?? null,
  createdBy: item?.createdBy ?? item?.CreatedBy ?? "",
});
