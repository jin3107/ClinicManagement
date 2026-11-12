/**
 * @typedef {Object} NhanVienRequest
 * @property {string} maNV - Employee ID (for updates)
 * @property {string} hoTen - Full name
 * @property {string} email - Email
 * @property {string} soDienThoai - Phone number
 * @property {string} password - Password
 * @property {string} role - Role
 */

export const createNhanVienRequest = (
	maNV = '',
	hoTen = '',
	email = '',
	soDienThoai = '',
	password = '',
	role = ''
) => ({
	maNV,
	hoTen,
	email,
	soDienThoai,
	password,
	role,
});