// src/contexts/RoleContext.jsx
import React, { createContext, useState} from "react";
import AxiosInstance from "./AxiosInstance"; // Adjust the import path as necessary
export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState("");
  // useEffect(() => {
  //   // Fetch user info from backend (recommended for security)
  //   const fetchRole = async () => {
  //     try {
  //       const res = await AxiosInstance.get("/users/me/");
  //       setRole(res.data.groups?.[0] || ""); // adjust based on your backend response
  //     } catch {
  //       setRole("");
  //     }
  //   };
  //   fetchRole();
  // }, []);
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};