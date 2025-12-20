import axios from 'axios';
import React, { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const axiousSecure = axios.create({
    baseURL:'https://blood-heros-server.vercel.app/'
})
const useAxiousSecure = () => {
    const {user, logOut} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        // intercept request
       const reqInterceptor = axiousSecure.interceptors.request.use(config=>{
            config.headers.Authorization = `Bearer ${user?.accessToken}`
            return config;
        })

        // interceptor response
        const resInterceptor = axiousSecure.interceptors.response.use((response)=>{
            return response;
        },(error)=>{
            console.log(error)
            const statusCode = error?.response?.status;
            if(statusCode===401 || statusCode === 403){
                logOut()
                .then(()=>{
                    navigate("/login")
                })
            }
            return Promise.reject(error)
        })

        return ()=>{
            axiousSecure.interceptors.request.eject(reqInterceptor);
            axiousSecure.interceptors.response.eject(resInterceptor);
        }
    },[user,logOut,navigate])


    return axiousSecure;
};

export default useAxiousSecure;