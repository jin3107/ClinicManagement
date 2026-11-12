import axios from "../config/axios";
import { createSearchRequest } from "../helpers";

export const getDanhMucDichVuById = async (id) =>
  await axios.get(`/danhmucdichvu/${id}`);

export const createDanhMucDichVu = async (payload) =>
  await axios.post("/danhmucdichvu", payload);

export const updateDanhMucDichVu = async (payload) =>
  await axios.put("/danhmucdichvu", payload);

export const deleteDanhMucDichVu = async (id) =>
  await axios.delete(`/danhmucdichvu/${id}`);

export const searchDanhMucDichVu = async (filters = null, pageIndex = 1, pageSize = 10) => {
  const searchRequest = createSearchRequest(filters, null, pageIndex, pageSize);
  return await axios.post("/danhmucdichvu/search", searchRequest);
};
