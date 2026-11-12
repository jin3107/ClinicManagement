import axios from "../config/axios";
import { createSearchRequest } from "../helpers";

export const getLichLamViecById = async (id) =>
  await axios.get(`/lichlamviec/${id}`);

export const createLichLamViec = async (payload) =>
  await axios.post("/lichlamviec", payload);

export const updateLichLamViec = async (payload) =>
  await axios.put("/lichlamviec", payload);

export const deleteLichLamViec = async (id) =>
  await axios.delete(`/lichlamviec/${id}`);

export const searchLichLamViec = async (filters = null, pageIndex = 1, pageSize = 10) => {
  const searchRequest = createSearchRequest(filters, null, pageIndex, pageSize);
  return await axios.post("/lichlamviec/search", searchRequest);
};
