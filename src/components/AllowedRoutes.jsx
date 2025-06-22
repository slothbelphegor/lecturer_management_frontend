import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { RoleContext } from "./RoleContext";

const AllowedRoute = ({allowedRoles}) => {
    // const {role} = useContext(RoleContext);
    const role = localStorage.getItem("Role") || ""; // Default to empty string if Role is not set
    console.log("AllowedRoute role: ", role);
    // Outlet is the child components
    return (
        allowedRoles.includes(role) ? <Outlet /> :null
    )
}

export default AllowedRoute;