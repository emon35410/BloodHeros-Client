import React, { useEffect, useRef } from 'react';
import Navbar from '../Pages/Shared/Navbar/Navbar';
import { Outlet, useLocation } from 'react-router';
import Footer from '../Pages/Shared/Footer/Footer';

const RootLayout = () => {
    const { pathname } = useLocation();
    const lenisRef = useRef(null);

    useEffect(() => {
        // Initialize Lenis
        if (window.Lenis) {
            lenisRef.current = new window.Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
            });

            const raf = (time) => {
                lenisRef.current?.raf(time);
                requestAnimationFrame(raf);
            };

            requestAnimationFrame(raf);
        }

        return () => {
            if (lenisRef.current) {
                lenisRef.current.destroy();
            }
        };
    }, []);

    // Scroll to top on route change
    useEffect(() => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0); // Fallback if Lenis is not active
        }
    }, [pathname]);

    return (
        /* এখানে 'bg-white' এবং 'dark:bg-slate-950' ব্যবহার করা হয়েছে 
           যাতে পুরো বডি মোড অনুযায়ী কালার চেঞ্জ করে।
        */
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Navbar />
            
            {/* মেইন কন্টেন্ট এরিয়া */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 py-4">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default RootLayout;