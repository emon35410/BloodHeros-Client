import axios from 'axios';
import React from 'react';

const axiousSecure = axios.create({
    baseURL:'http://localhost:3000'
})
const useAxiousSecure = () => {
    return axiousSecure;
};

export default useAxiousSecure;