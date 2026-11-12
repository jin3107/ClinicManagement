/**
 * @typedef {Object} NhanVien
 * @property {string} maNV - Employee ID
 * @property {string} hoTen - Full name
 * @property {string} email - Email
 * @property {string} soDienThoai - Phone number
 * @property {string} role - Role
 */

export const createNhanVien = (maNV = '', hoTen = '', email = '', soDienThoai = '', role = '') => ({
	maNV,
	hoTen,
	email,
	soDienThoai,
	role,
});

export const normalizeNhanVien = (item) => ({
	maNV: item?.maNV ?? item?.MaNV ?? '',
	hoTen: item?.hoTen ?? item?.HoTen ?? '',
	email: item?.email ?? item?.Email ?? '',
	soDienThoai: item?.soDienThoai ?? item?.SoDienThoai ?? '',
	role: item?.role ?? item?.Role ?? '',
});