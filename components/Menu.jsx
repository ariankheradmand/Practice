import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

const buttons = ["About Us", "Gallery", "Visit"];
const button_details = [
  {
    name: "Login",
    details: ["Email", "Phone", "Google" , ],
  },
  {
    name: "Sign up",
    details: ["Email", "Phone", "Google" , "Github"],
  },
];

const NavbarIconDetails = ({ selectedName }) => {
  const selectedButton = button_details.find(
    (btn) => btn.name === selectedName
  );

  return (
    <div
      className="text-white flex flex-col gap-2 border px-2 py-2 rounded-xl shadow-lg bg-white/15 animate__animated animate__fadeInRight"
    >
      <label className="animate__animated animate__fadeIn font-bold">
        {selectedName}
      </label>
      <div className="w-full border-white border-b-2 border-dashed"></div>
      {selectedButton &&
        selectedButton.details.map((detail, index) => (
          <div
            key={index}
            className="bg-slate-700/80 py-px w-24 rounded-lg animate__animated animate__fadeIn"
          >
            {detail}
          </div>
        ))}
    </div>
  );
};

const DropDown = ({ endOfPage, status, drawer, setDrawer }) => {
    const handleClickOutside = () => {
        if (drawer.show === false ) {
            setDrawer(true, event.target.textContent);
        }else {
            setDrawer(false, event.target.textContent);
            const data = event.target.textContent
            setTimeout(() => {
                if (drawer.selectedName !== data) {
                    setDrawer(true, data);
                }
            } , 100)
        }
      
    };
  return (
    <div
      dir="rtl"
      className={`fixed w-full font-thin right-0 text-center ${
        endOfPage ? "mb-1 bottom-14 " : "mt-1 top-14 "
      } ${
        status
          ? "animate__animated animate__fadeIn"
          : "animate__animated animate__fadeOut"
      } h-fit z-40`}
    >
      <div className="flex  items-start justify-start gap-2 overflow-auto">
        <div className="flex flex-col gap-2 w-4/12 border px-2 py-2 rounded-xl bg-white/15 ">
          <button
            onClick={() =>  handleClickOutside()}
            className="text-white  font-bold py-1 bg-slate-700/80 shadow-lg  rounded-lg"
          >
            Login
          </button>
          <button
            onClick={() => handleClickOutside()}
            className="text-white  font-bold py-1 bg-slate-700/80 shadow-lg  rounded-lg"
          >
            Sign up
          </button>
          {buttons.map((div) => (
            <button
              key={div}
              className="text-white  py-1 hover:text-gray-800 bg-slate-600/70 shadow-lg rounded-lg  animate__animated animate__fadeInRight"
            >
              {div}
            </button>
          ))}
        </div>
        {drawer.show && (
          <NavbarIconDetails selectedName={drawer.selectedName} />
        )}
      </div>
    </div>
  );
};

function Menu({ endOfPage }) {
  const [dropDown, setDropDown] = useState(false);
  const [status, setStatus] = useState(false);
  const dropDownRef = useRef(null);
  const [drawer, setDrawerState] = useState({ show: false, selectedName: "" });

  const setDrawer = (show, selectedName = "") => {
    setDrawerState({ show, selectedName });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setStatus(false);
        setTimeout(() => {
          setDropDown(false);
          setDrawer(false);
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
    <div className="flex items-center justify-center ">
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
          <Image
            className="animate__animated animate__fadeIn"
            src="/Close.svg"
            alt="Menu"
            width={24}
            height={24}
          />
        ) : (
          <Image
            className="animate__animated animate__fadeIn"
            src="/MenuIcon.svg"
            alt="Menu"
            width={24}
            height={24}
          />
        )}
      </button>
      {dropDown && (
        <div ref={dropDownRef}>
          <DropDown
            endOfPage={endOfPage}
            status={status}
            drawer={drawer}
            setDrawer={setDrawer}
          />
        </div>
      )}
    </div>
  );
}

export default Menu;
