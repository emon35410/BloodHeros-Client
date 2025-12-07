import Aos from 'aos';
import React, { useEffect } from 'react';
import Marquee from 'react-fast-marquee';
import 'aos/dist/aos.css';

const Collaborators = () => {
    const partners = [
        {
            name: "City General Hospital",
            type: "Medical Partner",
            icon: "🏥",
            color: "from-blue-500 to-cyan-500",
            description: "Leading healthcare provider with state-of-the-art blood bank facilities"
        },
        {
            name: "Red Cross Society",
            type: "NGO Partner",
            icon: "➕",
            color: "from-red-500 to-pink-500",
            description: "Global humanitarian organization supporting blood donation initiatives"
        },
        {
            name: "LifeCare Foundation",
            type: "Healthcare NGO",
            icon: "❤️",
            color: "from-pink-500 to-rose-500",
            description: "Dedicated to making healthcare accessible to all communities"
        },
        {
            name: "Metro Blood Bank",
            type: "Blood Bank",
            icon: "🩸",
            color: "from-purple-500 to-pink-500",
            description: "Certified blood bank with 24/7 emergency blood supply services"
        },
        {
            name: "Health Ministry",
            type: "Government",
            icon: "🏛️",
            color: "from-green-500 to-emerald-500",
            description: "Supporting national blood donation awareness campaigns"
        },
        {
            name: "Community Care",
            type: "Community Partner",
            icon: "🤝",
            color: "from-orange-500 to-amber-500",
            description: "Organizing local blood drives and community health programs"
        }
    ];
    useEffect(() => {
        Aos.init({ duration: 1000, once: true });
    }, []);

    const stats = [
        { number: "50+", label: "Partner Organizations", icon: "🤝" },
        { number: "200+", label: "Hospitals Connected", icon: "🏥" },
        { number: "100+", label: "Blood Banks", icon: "🩸" },
        { number: "30+", label: "NGO Partners", icon: "❤️" }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
                <div className="absolute top-20 left-10 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div data-aos="zoom-in" className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-200 mb-4">
                        <span className="text-2xl">🤝</span>
                        <span className="text-red-600 font-semibold text-sm">Our Network</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Our Trusted
                        <span className="block mt-2 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                            Collaborators
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Together with our partners, we're building a robust network to ensure blood is available whenever and wherever it's needed.
                    </p>
                </div>

                {/* Stats Section */}
                <div data-aos="zoom-in-up" className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                        >
                            <div className="text-4xl mb-3">{stat.icon}</div>
                            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                {stat.number}
                            </div>
                            <div className="text-gray-600 font-medium text-sm">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Partners Grid */}
                <Marquee  pauseOnHover={true} gradient={false} speed={100}>
                    <div data-aos="fade-up" className="flex py-5 gap-8 px-8">
                        {partners.map((partner, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl 
                transition-all duration-300 hover:-translate-y-3 border border-gray-100 
                relative overflow-hidden w-[350px]"
                            >
                                {/* Background Gradient */}
                                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${partner.color}
                opacity-10 rounded-full transform translate-x-10 -translate-y-10 
                group-hover:scale-150 transition-transform duration-500`}></div>

                                {/* Icon */}
                                <div className={`relative inline-flex items-center justify-center w-20 h-20 
                bg-gradient-to-br ${partner.color} rounded-2xl mb-6 text-4xl shadow-lg 
                group-hover:scale-110 transition-transform duration-300`}>
                                    {partner.icon}
                                </div>

                                {/* Content */}
                                <div className="relative">
                                    <div className={`inline-block px-3 py-1 bg-gradient-to-r ${partner.color} 
                    text-white text-xs font-semibold rounded-full mb-3`}>
                                        {partner.type}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 
                    group-hover:text-red-600 transition-colors duration-300">
                                        {partner.name}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {partner.description}
                                    </p>
                                </div>

                                {/* Verified Badge */}
                                <div className="absolute top-4 right-4">
                                    <div className="bg-green-500 rounded-full p-2 shadow-lg">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 
                            01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 
                            011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Marquee>


            </div>
        </section>
    );
};

export default Collaborators;