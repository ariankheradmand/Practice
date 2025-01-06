import React, { useEffect, useState } from "react";


function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
         window.removeEventListener("scroll", handleScroll);
        };
    })

    return (
        <nav className="flex items-center justify-center w-full ">
            <div 
                className={`flex items-center justify-between fixed w-11/12 bg-gradient-to-br from-blue-300/30 to-gray-800/30  backdrop-blur-md py-3 px-2 rounded-b-lg transition-all duration-300 
                    ${isScrolled ? 'top-2 rounded-xl' : 'top-0'}
                    `}
            >
                <div className="flex">
                    <div>AR</div>
                    <div className="text-white">2</div>
                </div>
                <div className="flex gap-2">
                    <div>Login</div>
                    <div>SignUp</div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;