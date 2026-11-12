/**
 * @typedef {Object} HoaDonResponse
 * @property {string} maHD
 * @property {string|Date} ngayThanhToan
 * @property {number} tongTien
 * @property {string} trangThaiThanhToan
 * @property {string} maLeTan
 * @property {string} maPK
 * @property {string} tenBenhNhan
 */

export const createHoaDonResponse = (
	maHD = "",
	ngayThanhToan = null,
	tongTien = 0,
	trangThaiThanhToan = "",
	maLeTan = "",
	maPK = "",
	tenBenhNhan = "",
) => ({
	maHD,
	ngayThanhToan,
	tongTien,
	trangThaiThanhToan,
	maLeTan,
	maPK,
	tenBenhNhan,
});
