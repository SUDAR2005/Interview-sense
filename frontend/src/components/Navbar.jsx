import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="flex justify-between items-center p-4 shadow-md relative z-50 bg-white">
            {/* Brand Title */}
            <Link to="/" className="text-[#147fdc] hover:text-[#7883ff] cursor-pointer text-3xl sm:text-4xl md:text-5xl">
                InterviewSense
            </Link>

            {/* Desktop Menu */}
            <ul className="hidden md:flex space-x-6 text-lg mt-2">
                <li>
                    <Link to="/" className="transition-all py-2 px-4 hover:border-b-2 hover:cursor-pointer">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/about" className="transition-all py-2 px-4 hover:border-b-2 hover:cursor-pointer">
                        About
                    </Link>
                </li>
                <li>
                    <Link to="/preparation" className="transition-all py-2 px-4 hover:border-b-2 hover:cursor-pointer">
                        Preparation
                    </Link>
                </li>
            </ul>

            {/* Mobile Menu Icon */}
            <div className="md:hidden z-50">
                {menuOpen ? (
                    <AiOutlineClose className="text-3xl cursor-pointer" onClick={toggleMenu} />
                ) : (
                    <AiOutlineMenu className="text-3xl cursor-pointer" onClick={toggleMenu} />
                )}
            </div>

            {/* Mobile Sidebar Menu */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out md:hidden ${
                menuOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="block text-[#147fdc] hover:text-[#7883ff] cursor-pointer text-3xl px-4 py-5"
                >
                    InterviewSense
                </Link>
                <ul className="flex flex-col p-4 space-y-6 text-lg">
                    <li>
                        <Link to="/" onClick={closeMenu} className="hover:text-blue-500 cursor-pointer hover:border-b-2">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" onClick={closeMenu} className="hover:text-blue-500 cursor-pointer hover:border-b-2">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link to="/preparation" onClick={closeMenu} className="hover:text-blue-500 cursor-pointer hover:border-b-2">
                            Preparation
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
