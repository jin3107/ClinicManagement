/**
 * @typedef {Object} HoaDonRequest
 * @property {string} maHD
 * @property {string|Date} ngayThanhToan
 * @property {number} tongTien
 * @property {string} trangThaiThanhToan
 * @property {string} maLeTan
 * @property {string} maPK
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

export const createHoaDonRequest = (
	maHD = "",
	ngayThanhToan = null,
	tongTien = 0,
	trangThaiThanhToan = "",
	maLeTan = "",
	maPK = null,
) => {
	const request = {
		ngayThanhToan: toRequestDateTime(ngayThanhToan),
		tongTien,
		trangThaiThanhToan,
		maPK,
	};
	if (maLeTan) request.maLeTan = maLeTan;
	if (maHD) request.maHD = maHD;
	return request;
};
