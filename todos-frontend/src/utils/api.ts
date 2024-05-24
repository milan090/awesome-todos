import axios from "axios";
import { User } from "../types/auth.types";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export const getUser = async (): Promise<User> => {
  const res = await api.get("/auth/user");
  return res.data;
}

export const register = async (email: string, password: string): Promise<User> => {
  const res = await api.post('/auth/register', { email, password });
  return res.data;
};

export const login = async (email: string, password: string): Promise<User> => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const logout = () => {
  return api.post('/auth/logout');
};

export default api;