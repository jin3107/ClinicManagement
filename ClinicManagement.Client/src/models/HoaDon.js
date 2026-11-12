/**
 * @typedef {Object} HoaDon
 * @property {string} maHD
 * @property {string|Date} ngayThanhToan
 * @property {number} tongTien
 * @property {string} trangThaiThanhToan
 * @property {string} maLeTan
 * @property {string} maPK
 * @property {string} tenBenhNhan
 */

export const createHoaDon = (
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

export const normalizeHoaDon = (item) => ({
	maHD: item?.maHD ?? item?.MaHD ?? "",
	ngayThanhToan: item?.ngayThanhToan ?? item?.NgayThanhToan ?? null,
	tongTien: Number(item?.tongTien ?? item?.TongTien ?? 0),
	trangThaiThanhToan:
		item?.trangThaiThanhToan ?? item?.TrangThaiThanhToan ?? "",
	maLeTan: item?.maLeTan ?? item?.MaLeTan ?? "",
	maPK: item?.maPK ?? item?.MaPK ?? "",
	tenBenhNhan: item?.tenBenhNhan ?? item?.TenBenhNhan ?? "",
});
