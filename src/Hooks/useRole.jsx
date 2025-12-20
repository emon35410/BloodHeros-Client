import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from './useAuth';
import useAxiousSecure from './useAxiousSecure';

const useRole = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiousSecure();
    const { isLoading:roleLoading, data: role = 'donor' } = useQuery({
        queryKey: ['donor-role', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`donors/role/${user.email}`)
            return res.data.role; 
        }
    });
    return { role, roleLoading }
};

export default useRole;