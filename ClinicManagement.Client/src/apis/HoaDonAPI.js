import axios from "../config/axios";
import { createSearchRequest } from "../helpers";

export const getHoaDonById = async (id) =>
	await axios.get(`/hoadon/${id}`);

export const createHoaDon = async (payload) =>
	await axios.post("/hoadon", payload);

export const updateHoaDon = async (payload) =>
	await axios.put("/hoadon", payload);

export const deleteHoaDon = async (id) =>
	await axios.delete(`/hoadon/${id}`);

export const searchHoaDon = async (filters = null, pageIndex = 1, pageSize = 10) => {
	const searchRequest = createSearchRequest(filters, null, pageIndex, pageSize);
	return await axios.post("/hoadon/search", searchRequest);
};
