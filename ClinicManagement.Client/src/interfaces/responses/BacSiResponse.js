/**
 * @typedef {Object} BacSiResponse
 * @property {string} maBS - Doctor ID
 * @property {string} hoTen - Full name
 * @property {string} chuyenKhoa - Specialty
 * @property {string} soDienThoai - Phone number
 * @property {string} email - Email
 */

export const createBacSiResponse = (
	maBS = '',
	hoTen = '',
	chuyenKhoa = '',
	soDienThoai = '',
	email = ''
) => ({
	maBS,
	hoTen,
	chuyenKhoa,
	soDienThoai,
	email,
});
