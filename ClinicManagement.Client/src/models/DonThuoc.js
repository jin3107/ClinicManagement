/**
 * @typedef {Object} DonThuoc
 * @property {string} maDT
 * @property {string} maPK
 * @property {string|Date} ngayKe
 * @property {Array} chiTietDonThuocs
 */

export const createDonThuoc = (
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

export const normalizeDonThuoc = (item) => ({
  maDT: item?.maDT ?? item?.MaDT ?? "",
  maPK: item?.maPK ?? item?.MaPK ?? "",
  ngayKe: item?.ngayKe ?? item?.NgayKe ?? null,
  chiTietDonThuocs:
    item?.chiTietDonThuocs ?? item?.ChiTietDonThuocs ?? [],
});
