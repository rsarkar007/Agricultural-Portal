import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="w-full bg-[#f8f9fa] border-t-2 border-[#0648b3] pt-10 pb-6">
            <div className="app-content-width px-4">
                <div className="panel-card-soft px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-8">

                    <div className="hidden md:block w-24">
                        <img src="/image/indiagovin_mp.jpg" alt="Left Logo" className="w-full" />
                    </div>

                    <div className="flex-1 text-center">
                        <div className="flex flex-wrap justify-center gap-3 text-xs font-medium text-gray-600">

                            {[
                                { name: "Home", path: "/" },
                                { name: "Copyright Policy", path: "/copyright" },
                                { name: "About the Portal", path: "/about" },
                                { name: "Site Map", path: "/" },
                                { name: "Terms of Use", path: "/" },
                                { name: "Feedback", path: "/" },
                                { name: "Help", path: "/helpline" },
                                { name: "Contact Us", path: "/contact" },
                                { name: "Downloads", path: "/" },
                            ].map((item, i) => (
                                <Link
                                    key={i}
                                    to={item.path}
                                    className="text-[#09afdf] text-sm w-fit px-3 py-2 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}

                        </div>
                    </div>

                    <div className="hidden md:block w-24">
                        <img src="/image/footer_right_logo.jpg" alt="Right Logo" className="w-full" />
                    </div>

                </div>
            </div>
        </footer>
    );
}
