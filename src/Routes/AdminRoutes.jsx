import React from 'react';
import useAuth from '../Hooks/useAuth';
import Loading from '../Components/Loading/Loading';
import useRole from '../Hooks/useRole';
import ForbiddenPage from '../Components/Forbidden/ForbiddenPage';

const AdminRoutes = ({ children }) => {
    const { loading } = useAuth();
    const { role, roleLoading } = useRole();
    if (loading || roleLoading) {
        return <Loading></Loading>;
    }
    if (role !== 'admin') { 
        return <ForbiddenPage></ForbiddenPage>
    }
    return children;
};

export default AdminRoutes;