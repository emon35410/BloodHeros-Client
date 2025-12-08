import Aos from 'aos';
import React, { useEffect } from 'react';
import 'aos/dist/aos.css';

const FeaturedSection = () => {
    const features = [
        {
            icon: "🩸",
            title: "Easy Blood Donation",
            description: "Simple and quick donation process with pre-screening and comfortable facilities. Our trained staff ensures your safety and comfort throughout.",
            color: "from-red-500 to-pink-500"
        },
        {
            icon: "🔍",
            title: "Find Donors Instantly",
            description: "Search our database of verified donors by blood type and location. Connect with compatible donors in your area within minutes.",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: "🚨",
            title: "Emergency Requests",
            description: "Post urgent blood requirements and get immediate responses from nearby donors. Life-saving help is just a click away.",
            color: "from-orange-500 to-red-500"
        },
        {
            icon: "📱",
            title: "Real-Time Notifications",
            description: "Get instant alerts when someone needs your blood type. Stay connected and be ready to save lives at any moment.",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: "🏥",
            title: "Verified Blood Banks",
            description: "Access a network of certified hospitals and blood banks. Check real-time blood availability and schedule appointments online.",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: "🎖️",
            title: "Donor Recognition",
            description: "Earn badges and certificates for your contributions. Track your donation history and see the lives you've impacted.",
            color: "from-yellow-500 to-orange-500"
        }
    ];

    useEffect(() => {
            Aos.init({ duration: 1000, once: true });
        }, []);

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div  data-aos="fade-left" className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-200 mb-4">
                        <span className="text-2xl">❤️</span>
                        <span className="text-red-600 font-semibold text-sm">Why Choose BloodHeroes</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Making Blood Donation
                        <span className="block mt-2 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                            Simple & Accessible
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        We connect donors with those in need, creating a lifesaving network that's always there when it matters most.
                    </p>
                </div>

                {/* Features Grid */}
                <div data-aos="fade-right" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-5 rounded-2xl transform rotate-12 group-hover:rotate-6 transition-transform duration-300`}></div>

                            <div className={`relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl mb-6 text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

              
               
            </div>
        </section>
    );
};

export default FeaturedSection;