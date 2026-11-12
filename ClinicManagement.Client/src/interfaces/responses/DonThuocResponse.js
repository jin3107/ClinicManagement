/**
 * @typedef {Object} DonThuocResponse
 * @property {string} maDT
 * @property {string} maPK
 * @property {string|Date} ngayKe
 * @property {Array} chiTietDonThuocs
 */

export const createDonThuocResponse = (
  maDT = "",
  maPK = "",
  ngayKe = null,
  chiTietDonThuocs = [],
) => ({
  maDT,
  maPK,
  ngayKe,
  chiTietDonThuocs,
});
