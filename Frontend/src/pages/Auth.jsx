import { redirect } from "react-router-dom";
import { apiFetch } from "../utils/Fetch";
import { toast } from "sonner";

const getToken = () => {
  return localStorage.getItem("token");
};

export const authLoader = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw redirect("/");
  }

  try {
    const res = await apiFetch("/auth/me");
    const user = await res.json();
    return user;
  } catch {
    localStorage.removeItem("token");
    throw redirect("/");
  }
};

export const unAuthLoader = () => {
  const token = getToken();

  if (token) {
    return redirect("/home");
  }
};
