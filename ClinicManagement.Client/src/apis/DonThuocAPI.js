import axios from "../config/axios";
import { createSearchRequest } from "../helpers";

export const getDonThuocById = async (id) =>
  await axios.get(`/donthuoc/${id}`);

export const createDonThuoc = async (payload) =>
  await axios.post("/donthuoc", payload);

export const updateDonThuoc = async (payload) =>
  await axios.put("/donthuoc", payload);

export const deleteDonThuoc = async (id) =>
  await axios.delete(`/donthuoc/${id}`);

export const searchDonThuoc = async (filters = null, pageIndex = 1, pageSize = 10) => {
  const searchRequest = createSearchRequest(filters, null, pageIndex, pageSize);
  return await axios.post("/donthuoc/search", searchRequest);
};
