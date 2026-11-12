/**
 * @typedef {Object} PhieuKham
 * @property {string} maPK
 * @property {string|Date} ngayKham
 * @property {string} trieuChung
 * @property {string} chuanDoan
 * @property {string} huongDieuTri
 * @property {string} trangThaiTiepNhan
 * @property {string} maLH
 * @property {string} maBS
 * @property {string} tenBacSi
 * @property {string} tenBenhNhan
 */

export const createPhieuKham = (
  maPK = "",
  ngayKham = null,
  trieuChung = "",
  chuanDoan = "",
  huongDieuTri = "",
  trangThaiTiepNhan = "",
  maLH = null,
  maBS = null,
  tenBacSi = "",
  tenBenhNhan = "",
) => ({
  maPK,
  ngayKham,
  trieuChung,
  chuanDoan,
  huongDieuTri,
  trangThaiTiepNhan,
  maLH,
  maBS,
  tenBacSi,
  tenBenhNhan,
});

export const normalizePhieuKham = (item) => ({
  maPK: item?.maPK ?? item?.MaPK ?? "",
  ngayKham: item?.ngayKham ?? item?.NgayKham ?? null,
  trieuChung: item?.trieuChung ?? item?.TrieuChung ?? "",
  chuanDoan: item?.chuanDoan ?? item?.ChuanDoan ?? "",
  huongDieuTri: item?.huongDieuTri ?? item?.HuongDieuTri ?? "",
  trangThaiTiepNhan:
    item?.trangThaiTiepNhan ?? item?.TrangThaiTiepNhan ?? "",
  maLH: item?.maLH ?? item?.MaLH ?? null,
  maBS: item?.maBS ?? item?.MaBS ?? null,
  tenBacSi: item?.tenBacSi ?? item?.TenBacSi ?? "",
  tenBenhNhan: item?.tenBenhNhan ?? item?.TenBenhNhan ?? "",
});
