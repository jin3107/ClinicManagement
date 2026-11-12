import axios from "../config/axios";
import { createSearchRequest } from "../helpers";

export const getBenhNhanById = async (id) =>
  await axios.get(`/benhnhan/${id}`);

export const createBenhNhan = async (payload) =>
  await axios.post("/benhnhan", payload);

export const updateBenhNhan = async (payload) =>
  await axios.put("/benhnhan", payload);

export const deleteBenhNhan = async (id) =>
  await axios.delete(`/benhnhan/${id}`);

export const searchBenhNhan = async (filters = null, pageIndex = 1, pageSize = 10) => {
  const searchRequest = createSearchRequest(filters, null, pageIndex, pageSize);
  return await axios.post("/benhnhan/search", searchRequest);
};
