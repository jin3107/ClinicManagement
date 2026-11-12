/**
 * @typedef {Object} NhanVienResponse
 * @property {string} maNV - Employee ID
 * @property {string} hoTen - Full name
 * @property {string} email - Email
 * @property {string} soDienThoai - Phone number
 * @property {string} role - Role
 * @property {string} password - Password
 */

// password không trả về frontend
export const createNhanVienResponse = (
	maNV = '',
	hoTen = '',
	email = '',
	soDienThoai = '',
	role = ''
) => ({
	maNV,
	hoTen,
	email,
	soDienThoai,
	role,
});