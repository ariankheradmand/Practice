import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

const buttons = ["درباره ما", "گالری", "مراجعه"];
const button_details = [
  {
    name: "ورود",
    details: ["ایمیل", "شماره تلفن", "گوگل"],
  },
  {
    name: "ثبت نام",
    details: ["ایمیل", "شماره تلفن", "گوگل"],
  },
];

const NavbarIconDetails = ({ selectedName }) => {
  const selectedButton = button_details.find(
    (btn) => btn.name === selectedName
  );

  return (
    <div
      dir="rtl"
      className="text-white flex flex-col gap-2 border px-2 py-2 rounded-xl shadow-lg bg-slate-800/20 animate__animated animate__fadeInRight"
    >
      <label className="animate__animated animate__fadeIn font-bold">
        {selectedName}
      </label>
      <div className="w-full border-white border-b-2 border-dashed"></div>
      {selectedButton &&
        selectedButton.details.map((detail, index) => (
          <div
            key={index}
            className="bg-slate-700/80 pr-2 w-24 rounded-lg animate__animated animate__fadeIn"
          >
            {detail}
          </div>
        ))}
    </div>
  );
};

const DropDown = ({ endOfPage, status, drawer, setDrawer }) => {
    const handleClickOutside = () => {
      setDrawer(true, event.target.textContent);
    };
  return (
    <div
      dir="rtl"
      className={`fixed w-full font-thin ${
        endOfPage ? "mb-1 bottom-14 right-1" : "mt-1 top-14 right-1"
      } ${
        status
          ? "animate__animated animate__fadeIn"
          : "animate__animated animate__fadeOut"
      } h-fit z-40`}
    >
      <div className="flex items-start justify-start gap-2 overflow-auto">
        <div className="flex flex-col gap-2 w-4/12 border px-2 py-2 rounded-xl shadow-lg bg-slate-800/20">
          <button
            onClick={() =>  handleClickOutside()}
            className="text-white text-right font-bold bg-slate-700/80 shadow-lg pr-2 rounded-lg"
          >
            ورود
          </button>
          <button
            onClick={() => handleClickOutside()}
            className="text-white text-right font-bold bg-slate-700/80 shadow-lg pr-2 rounded-lg"
          >
            ثبت نام
          </button>
          {buttons.map((div) => (
            <button
              key={div}
              className="text-white text-right hover:text-gray-800 bg-slate-600/70 shadow-lg rounded-lg pr-2 animate__animated animate__fadeInRight"
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
          <Image
            className="animate__animated animate__fadeIn"
            src="/Close.svg"
            alt="Menu"
            width={20}
            height={20}
          />
        ) : (
          <Image
            className="animate__animated animate__fadeIn"
            src="/MenuIcon.svg"
            alt="Menu"
            width={20}
            height={20}
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
