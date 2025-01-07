import React, { useEffect, useState } from "react";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [endOfPage, setEndOfPage] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);

      // Detect end of the page
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight || document.body.offsetHeight;
      
      if (scrollPosition >= threshold - 1) {
        setEndOfPage(true);
      } else {
        setEndOfPage(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className="flex items-center justify-center w-full">
      <div
        className={`flex items-center justify-between z-50 font-bold w-11/12 bg-gradient-to-br fixed from-gray-300/40 to-gray-800/60 bg-[length:200%_200%] animate-gradient backdrop-blur-md py-3 px-2 rounded-b-lg transition-all  duration-700
                   xl:w-7/12 xl:text-2xl md:w-8/12 
                  ${
                    endOfPage
                      ? ` translate-y-[calc(100vh-26px)] w-full rounded-b-none rounded-t-xl`
                      : isScrolled
                      ? "translate-y-10 rounded-xl"
                      : "translate-y-6 w-full"
                  }                                          
                  `}
      >
        <div className="flex">
          <div>AR</div>
          <div className="text-white">2</div>
        </div>

        <div className="flex gap-2">
          {/* Login Button */}
          <div className="relative cursor-pointer p-[3px] rounded-lg bg-gradient-to-r from-purple-500 via-orange-400 to-purple-500 bg-[length:200%_200%] animate-gradient">
            <div className="bg-white/80 py-px px-2 rounded-lg relative z-10">
              <div className="bg-gradient-to-b from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Login
              </div>
            </div>
          </div>

          {/* SignUp Button */}
          <div className="relative p-[3px] cursor-pointer rounded-lg bg-gradient-to-r from-purple-500 via-orange-400 to-purple-500 bg-[length:200%_200%] animate-gradient">
            <div className="bg-white/80 py-px px-2 rounded-lg relative z-10">
              <div className="bg-gradient-to-b from-purple-600 to-blue-600 bg-clip-text text-transparent">
                SignUp
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
