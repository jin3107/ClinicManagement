import axios from "../config/axios";

export const login = async (payload) =>
	await axios.post("/authentication/login", payload);

export const register = async (payload) =>
	await axios.post("/authentication/register", payload);

export const logout = async () => await axios.post("/authentication/logout");

export const getProfile = async () =>
	await axios.get("/authentication/me");

export const refreshToken = async () => 
	await axios.post("/authentication/refresh-token");

export const changePassword = async (payload) => await axios.post("/authentication/change-password", payload);

export const sendOtp = async (payload) => await axios.post("/authentication/send-otp", payload);

export const verifyOtp = async (payload) => await axios.post("/authentication/verify-otp", payload);

export const resetPassword = async (payload) => await axios.post("/authentication/reset-password", payload);