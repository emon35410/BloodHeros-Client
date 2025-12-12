import React from 'react';
import logo from "../../../assets/bloodheros_logo.png";
import { Link } from 'react-router';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-blue-900 to-red-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

                    {/* Brand Section */}
                    <div>
                        <div>
                            <Link className="btn btn-ghost flex items-center gap-2 h-auto" to="/">
                                <img
                                    src={logo}
                                    alt="BloodHeroes Logo"
                                    className="h-12 md:h-14 lg:h-16 w-auto object-contain drop-shadow-md"
                                />
                                <span className="text-xl lg:text-4xl font-bold bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent sm:inline">
                                    Blood<span className='text-green-500'>Heroes</span>
                                </span>
                            </Link>
                            <p className="text-white/85 leading-relaxed">
                                Saving lives one donation at a time. Join our community of heroes making a difference.
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3 mt-5">
                            <Link to="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:-translate-y-1" aria-label="Facebook">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                </svg>
                            </Link>
                            <Link to="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:-translate-y-1" aria-label="Twitter">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                                </svg>
                            </Link>
                            <Link to="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:-translate-y-1" aria-label="Instagram">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="17.5" cy="6.5" r="1" />
                                </svg>
                            </Link>
                            <Link to="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:-translate-y-1" aria-label="LinkedIn">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                                    <circle cx="4" cy="4" r="2" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-semibold text-red-200 mb-4 flex items-center gap-2">
                            <span>❤️</span>
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            <li><Link to="#about" className="text-white/85 hover:text-red-200 transition-all duration-300 inline-block hover:translate-x-1">About Us</Link></li>
                            <li><Link to="#eligibility" className="text-white/85 hover:text-red-200 transition-all duration-300 inline-block hover:translate-x-1">Eligibility</Link></li>
                            <li><Link to="#process" className="text-white/85 hover:text-red-200 transition-all duration-300 inline-block hover:translate-x-1">Donation Process</Link></li>
                            <li><Link to="/location" className="text-white/85 hover:text-red-200 transition-all duration-300 inline-block hover:translate-x-1">Find Locations</Link></li>
                            <li><Link to="#faq" className="text-white/85 hover:text-red-200 transition-all duration-300 inline-block hover:translate-x-1">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Get Involved */}
                    <div>
                        <h3 className="text-xl font-semibold text-red-200 mb-4 flex items-center gap-2">
                            <span>❤️</span>
                            Get Involved
                        </h3>
                        <ul className="space-y-3">
                            <li><Link to="#donate" className="text-white/85 hover:text-red-200 transition-all duration-300 inline-block hover:translate-x-1">Donate Blood</Link></li>
                            <li><Link to="#volunteer" className="text-white/85 hover:text-red-200 transition-all duration-300 inline-block hover:translate-x-1">Volunteer</Link></li>
                            <li><Link to="#organize" className="text-white/85 hover:text-red-200 transition-all duration-300 inline-block hover:translate-x-1">Organize Drive</Link></li>
                            <li><Link to="#partner" className="text-white/85 hover:text-red-200 transition-all duration-300 inline-block hover:translate-x-1">Partner With Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h3 className="text-xl font-semibold text-red-200 mb-4 flex items-center gap-2">
                            <span>❤️</span>
                            Contact Us
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-white/85">
                                <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center flex-shrink-0">
                                    <span>📞</span>
                                </div>
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/85">
                                <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center flex-shrink-0">
                                    <span>✉️</span>
                                </div>
                                <span>info@bloodheroes.org</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/85">
                                <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center flex-shrink-0">
                                    <span>📍</span>
                                </div>
                                <span>123 Hero Lane, City, ST 12345</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/85">
                                <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center flex-shrink-0">
                                    <span>🕐</span>
                                </div>
                                <span>24/7 Emergency Hotline</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-white/70 text-sm">
                        &copy; 2024 BloodHeroes. All rights reserved. Every drop counts.
                    </div>
                    <div className="flex flex-wrap gap-6 text-sm">
                        <Link to="#privacy" className="text-white/70 hover:text-red-200 transition-colors duration-300">Privacy Policy</Link>
                        <Link to="#terms" className="text-white/70 hover:text-red-200 transition-colors duration-300">Terms of Service</Link>
                        <Link to="#accessibility" className="text-white/70 hover:text-red-200 transition-colors duration-300">Accessibility</Link>
                        <Link to="#sitemap" className="text-white/70 hover:text-red-200 transition-colors duration-300">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
