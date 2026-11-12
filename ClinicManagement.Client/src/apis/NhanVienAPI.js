import axios from "../config/axios";
import { createSearchRequest } from "../helpers";

export const getNhanVienById = async (id) =>
	await axios.get(`/nhanvien/${id}`);

export const createNhanVien = async (payload) =>
	await axios.post("/nhanvien", payload);

export const updateNhanVien = async (payload) =>
	await axios.put("/nhanvien", payload);

export const deleteNhanVien = async (id) =>
	await axios.delete(`/nhanvien/${id}`);

export const searchNhanVien = async (filters = null, pageIndex = 1, pageSize = 10) => {
    const searchRequest = createSearchRequest(filters, null, pageIndex, pageSize);
    return await axios.post("/nhanvien/search", searchRequest);
};