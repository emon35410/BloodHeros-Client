import React from 'react';
import { Link, Outlet } from 'react-router';
import logo from "../assets/bloodheros_logo.png"

const AuthLayout = () => {
    return (
        <div>
            <Link to="/" className="btn btn-ghost flex items-center gap-2 h-auto py-2">

                <img
                    src={logo}
                    alt="BloodHeroes Logo"
                    className="h-12 md:h-14 lg:h-16 w-auto object-contain drop-shadow-md"
                />

                <span className="text-xl lg:text-4xl font-bold bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent  sm:inline">
                    Blood<span className='text-green-500'>Heroes</span>
                </span>

            </Link>
            <Outlet></Outlet>
        </div>
    );
};

export default AuthLayout;