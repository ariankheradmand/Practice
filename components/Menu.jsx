import Image from "next/image";
import React, { useState } from "react";

let DropDown = ({ endOfPage, status }) => {
  return (
    <div
      className={`fixed w-6/12 px-4 py-2  font-thin bg-gray-600/80 backdrop-blur-md
    ${endOfPage ? "mb-1 bottom-14 right-1" : "mt-1 top-14 right-1"}
    ${
        status
        ? "animate__animated animate__fadeIn"
        : "animate__animated animate__fadeOut"
    }
    
    rounded-xl h-fit z-[100]`}
    >
        <div className="flex flex-col gap-2">
      <p className="">
        AR<span className="text-white">2</span>
      </p>
      <div className="w-full border-b-2 border-dashed border-gray-800"></div>

      <div className="text-white ">About Us</div>

      <div className="text-white">Gallery</div>

      <div className="text-white">Visit</div>
      </div>
    </div>
  );
};

function Menu({ endOfPage }) {
  const [dropDown, setDropDown] = useState(false);
  const [status , setStatus] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={() => {
          if (dropDown) {
            setStatus(false);
            setTimeout(() =>{
                setDropDown(false);
            }, 500)
            
          } else {
            setStatus(true);
            setDropDown(true);
          }
        }}
      >
        {status ? (
            <div>
          <Image
            className="animate__animated animate__fadeIn"
            src="/Close.svg"
            alt="Menu"
            width={25}
            height={15}
          />
          </div>
        ) : (
          <Image
            className="animate__animated animate__fadeIn"
            src="/MenuIcon.svg"
            alt="Menu"
            width={25}
            height={25}
          />
        )}
      </button>
      {dropDown ? <DropDown endOfPage={endOfPage} status={status} /> : null}
    </div>
  );
}

export default Menu;
