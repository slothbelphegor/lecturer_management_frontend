import{ useState, useEffect} from "react";
import { RoleContext } from "./RoleContext";
import AxiosInstance from "./AxiosInstance";


export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(() => localStorage.getItem("Role"));
  
  useEffect(() => {
    // Only fetch if token exists
    if (localStorage.getItem("Token")) {
      // AxiosInstance.get("/users/me/")
      //   .then(res => {
      //     console.log("RoleProvider: Fetched role from backend:", res.data.groups[0]);
      //     const backendRole = res.data.group || "";
      //     setRole(backendRole);
      //     localStorage.setItem("Role", backendRole);
      //   })
      //   .catch(() => setRole(localStorage.getItem("Role") || ""));
      setRole(localStorage.getItem("Role"));
      console.log("RoleProvider: Initialized role from localStorage:", localStorage.getItem("Role"));
    }
  }, []);
  
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};