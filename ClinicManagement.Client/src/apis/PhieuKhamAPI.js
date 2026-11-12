import axios from "../config/axios";
import { createSearchRequest } from "../helpers";

export const getPhieuKhamById = async (id) =>
  await axios.get(`/phieukham/${id}`);

export const createPhieuKham = async (payload) =>
  await axios.post("/phieukham", payload);

export const updatePhieuKham = async (payload) =>
  await axios.put("/phieukham", payload);

export const deletePhieuKham = async (id) =>
  await axios.delete(`/phieukham/${id}`);

export const searchPhieuKham = async (filters = null, pageIndex = 1, pageSize = 10) => {
  const searchRequest = createSearchRequest(filters, null, pageIndex, pageSize);
  return await axios.post("/phieukham/search", searchRequest);
};
