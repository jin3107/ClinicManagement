import axios from "../config/axios";

export const createPhieuKhamDichVu = async (payload) =>
  await axios.post("/phieukhamdichvu", payload);

export const getPhieuKhamDichVuByExam = async (maPK) =>
  await axios.get(`/phieukhamdichvu/by-exam/${maPK}`);

export const deletePhieuKhamDichVu = async (id) =>
  await axios.delete(`/phieukhamdichvu/${id}`);
