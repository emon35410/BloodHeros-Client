import React from 'react';
import useAuth from '../Hooks/useAuth';
import useRole from '../Hooks/useRole';
import Loading from '../Components/Loading/Loading';


const AdminOrVolunteerRoute = ({ children }) => {
    const { loading } = useAuth();
    const { role, roleLoading } = useRole();
    
    if (loading || roleLoading) {
        return <Loading></Loading>;
    }

    if (role !== 'admin' && role !== 'volunteer') { 
        return <ForbiddenPage></ForbiddenPage>
    }
    
    return children;
};

export default AdminOrVolunteerRoute;