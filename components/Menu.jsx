import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

let DropDown = ({ endOfPage, status }) => {
  return (
    <div
      className={`fixed w-6/12 px-4 py-2 font-thin bg-gray-500/80 
    ${endOfPage ? "mb-1 bottom-14 right-1" : "mt-1 top-14 right-1"}
    ${
      status
        ? "animate__animated animate__fadeIn"
        : "animate__animated animate__fadeOut"
    }
    rounded-xl h-fit z-40`}
    >
      <div className="flex flex-col gap-2">

        <div className="text-white font-bold">Login</div>
        <div className="text-white font-bold">Signup</div>
        <div className="text-white">About Us</div>
        <div className="text-white">Gallery</div>
        <div className="text-white">Visit</div>
      </div>
    </div>
  );
};

function Menu({ endOfPage }) {
  const [dropDown, setDropDown] = useState(false);
  const [status, setStatus] = useState(false);
  const dropDownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setStatus(false);
        setTimeout(() => {
          setDropDown(false);
        }, 500);
      }
    };

    if (dropDown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropDown]);

  return (
    <div className="flex items-center justify-center relative">
      <button
        onClick={() => {
          if (dropDown) {
            setStatus(false);
            setTimeout(() => {
              setDropDown(false);
            }, 500);
          } else {
            setStatus(true);
            setDropDown(true);
          }
        }}
      >
        {status ? (
          <div>
            <Image
              className="animate__animated animate__fadeIn "
              src="/Close.svg"
              alt="Menu"
              width={25}
              height={25}
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
      {dropDown ? (
        <div ref={dropDownRef}>
          <DropDown endOfPage={endOfPage} status={status} />
        </div>
      ) : null}
    </div>
  );
}

export default Menu;
