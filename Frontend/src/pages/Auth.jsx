import { redirect } from "react-router-dom";

const getToken = () => {
  return localStorage.getItem("token");
};

export const authLoader = () => {
  const token = getToken();

  if (!token) {
    return redirect("/");
  }
};

export const unAuthLoader = () => {
  const token = getToken();

  if (token) {
    return redirect("/home");
  }
};
