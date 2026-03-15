import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
    const isAuthenticated = localStorage.getItem('jona_authenticated') === 'true';

    if (isAuthenticated) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;