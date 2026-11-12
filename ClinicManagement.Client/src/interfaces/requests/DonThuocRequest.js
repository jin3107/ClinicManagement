/**
 * @typedef {Object} DonThuocRequest
 * @property {string} maDT
 * @property {string} maPK
 * @property {Array} chiTietDonThuocs
 */

export const createDonThuocRequest = (
  maDT = "",
  maPK = "",
  chiTietDonThuocs = [],
) => {
  const request = {
    maPK,
    chiTietDonThuocs,
  };
  if (maDT) request.maDT = maDT;
  return request;
};
