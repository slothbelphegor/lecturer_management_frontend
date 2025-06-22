import { Outlet, Navigate } from "react-router-dom";


const ProtectedRoute = () => {
    const token = localStorage.getItem('Token');
    // Outlet is the child components
    return(
        token? <Outlet /> : <Navigate to="/login" />
    )
}

export default ProtectedRoute;