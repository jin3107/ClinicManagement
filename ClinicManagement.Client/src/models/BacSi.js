/**
 * @typedef {Object} BacSi
 * @property {string} maBS - Doctor ID
 * @property {string} hoTen - Full name
 * @property {string} chuyenKhoa - Specialty
 * @property {string} soDienThoai - Phone number
 * @property {string} email - Email
 */

export const createBacSi = (
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

export const normalizeBacSi = (item) => ({
	maBS: item?.maBS ?? item?.MaBS ?? '',
	hoTen: item?.hoTen ?? item?.HoTen ?? '',
	chuyenKhoa: item?.chuyenKhoa ?? item?.ChuyenKhoa ?? '',
	soDienThoai: item?.soDienThoai ?? item?.SoDienThoai ?? '',
	email: item?.email ?? item?.Email ?? '',
});
