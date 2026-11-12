import axios from "../config/axios";
import { createSearchRequest } from "../helpers";

export const getLichHenById = async (id) =>
  await axios.get(`/lichhen/${id}`);

export const createLichHen = async (payload) =>
  await axios.post("/lichhen", payload);

export const updateLichHen = async (payload) =>
  await axios.put("/lichhen", payload);

export const deleteLichHen = async (id) =>
  await axios.delete(`/lichhen/${id}`);

export const searchLichHen = async (filters = null, pageIndex = 1, pageSize = 10) => {
  const searchRequest = createSearchRequest(filters, null, pageIndex, pageSize);
  return await axios.post("/lichhen/search", searchRequest);
};