import axios from "../config/axios";
import { createSearchRequest } from "../helpers";

export const getDanhMucThuocById = async (id) =>
  await axios.get(`/danhmucthuoc/${id}`);

export const createDanhMucThuoc = async (payload) =>
  await axios.post("/danhmucthuoc", payload);

export const updateDanhMucThuoc = async (payload) =>
  await axios.put("/danhmucthuoc", payload);

export const deleteDanhMucThuoc = async (id) =>
  await axios.delete(`/danhmucthuoc/${id}`);

export const searchDanhMucThuoc = async (filters = null, pageIndex = 1, pageSize = 10) => {
  const searchRequest = createSearchRequest(filters, null, pageIndex, pageSize);
  return await axios.post("/danhmucthuoc/search", searchRequest);
};
