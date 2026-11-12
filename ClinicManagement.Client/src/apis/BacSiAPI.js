import axios from "../config/axios";
import { createSearchRequest } from "../helpers";

export const getBacSiById = async (id) =>
	await axios.get(`/bacsi/${id}`);

export const createBacSi = async (payload) =>
	await axios.post("/bacsi", payload);

export const updateBacSi = async (payload) =>
	await axios.put("/bacsi", payload);

export const deleteBacSi = async (id) =>
	await axios.delete(`/bacsi/${id}`);

export const searchBacSi = async (filters = null, pageIndex = 1, pageSize = 10) => {
	const searchRequest = createSearchRequest(filters, null, pageIndex, pageSize);
	return await axios.post("/bacsi/search", searchRequest);
};
