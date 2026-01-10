import React from 'react';
import logo from "../../../assets/bloodheros_logo.png";
import { Link } from 'react-router';

const Footer = () => {
    return (
        /* bg-slate-50: লাইট মোডে একদম হালকা ধূসর (চোখের জন্য আরামদায়ক)
           dark:bg-[#0C0F16]: ডার্ক মোডে গভীর কালো/নীল
        */
        <footer className="bg-slate-50 dark:bg-[#0C0F16] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/50 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link className="flex items-center gap-2 mb-6 group" to="/">
                            <img
                                src={logo}
                                alt="BloodHeroes Logo"
                                className="h-10 w-auto object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                            />
                            {/* টেক্সট কালার লাইট মোডে slate-900 এবং ডার্ক মোডে white */}
                            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">
                                Blood<span className="text-rose-600">Heroes</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-6 font-medium">
                            Empowering communities through blood donation. Join our mission to save lives, one drop at a time. Every hero counts.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {/* Facebook */}
                            <Link
                                to="https://facebook.com/your-profile"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-[#1877F2] hover:text-white transition-all duration-300 group"
                                aria-label="Facebook"
                            >
                                <svg className="w-4 h-4 fill-current opacity-80 group-hover:opacity-100" viewBox="0 0 24 24">
                                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                </svg>
                            </Link>

                            {/* Instagram */}
                            <Link
                                to="https://instagram.com/your-profile"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-[#E4405F] hover:text-white transition-all duration-300 group"
                                aria-label="Instagram"
                            >
                                <svg className="w-4 h-4 fill-current opacity-80 group-hover:opacity-100" viewBox="0 0 24 24">
                                    <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm10.5 4.5a1 1 0 100-2 1 1 0 000 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
                                </svg>
                            </Link>

                            {/* LinkedIn */}
                            <Link
                                to="https://linkedin.com/your-profile"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-[#0A66C2] hover:text-white transition-all duration-300 group"
                                aria-label="LinkedIn"
                            >
                                <svg className="w-4 h-4 fill-current opacity-80 group-hover:opacity-100" viewBox="0 0 24 24">
                                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Explore */}
                    <div>
                        <h3 className="text-slate-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-widest flex items-center gap-2 transition-colors">
                            <span className="w-2 h-2 bg-rose-600 rounded-full"></span> Explore
                        </h3>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="/about" className="hover:text-rose-600 transition-colors inline-block hover:translate-x-1 duration-300">About Our Mission</Link></li>
                            <li><Link to="/location" className="hover:text-rose-600 transition-colors inline-block hover:translate-x-1 duration-300">Search Blood Centers</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-slate-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-widest flex items-center gap-2 transition-colors">
                            <span className="w-2 h-2 bg-rose-600 rounded-full"></span> Actions
                        </h3>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="/donateblood" className="hover:text-rose-600 transition-colors inline-block hover:translate-x-1 duration-300">Donate Blood Now</Link></li>
                            <li><Link to="/privacy" className="hover:text-rose-600 transition-colors inline-block hover:translate-x-1 duration-300">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Official Contact */}
                    <div>
                        <h3 className="text-slate-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-widest flex items-center gap-2 transition-colors">
                            <span className="w-2 h-2 bg-rose-600 rounded-full"></span> Get in Touch
                        </h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-start gap-3 group">
                                <span className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg group-hover:border-rose-600/30 transition-colors shadow-sm">📞</span>
                                <div>
                                    <p className="text-slate-900 dark:text-white font-bold transition-colors">+1 (555) 123-4567</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Mon-Fri 9am-6pm</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 group">
                                <span className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg group-hover:border-rose-600/30 transition-colors shadow-sm">✉️</span>
                                <div>
                                    <p className="text-slate-900 dark:text-white font-bold transition-colors">support@bloodheroes.org</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Quick Response</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-medium text-slate-500 text-center md:text-left">
                        &copy; {new Date().getFullYear()} <span className="text-slate-900 dark:text-slate-300 transition-colors">BloodHeroes</span>. All rights reserved. <br className="md:hidden" />
                        Built with ❤️ for humanity.
                    </p>
                    <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
                        <Link to="/terms" className="hover:text-rose-600 dark:hover:text-white transition-colors">Terms</Link>
                        <Link to="/privacy" className="hover:text-rose-600 dark:hover:text-white transition-colors">Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;