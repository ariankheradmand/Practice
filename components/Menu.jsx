import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

const buttons = ["درباره ما", "گالری", "مراجعه"];

const Gallery = () => {
  return <div dir="rtl" className="text-white flex flex-col gap-2   border  px-2 py-2 rounded-xl shadow-lg bg-slate-800/20 animate__animated animate__fadeInRight">
    <label>ثبت نام</label>
    <div className="w-full border-white border-b-2 border-dashed"></div>
    <div className="bg-slate-700/80 pr-2 w-24 rounded-lg animate__animated animate__fadeIn">ایمیل</div>
    <div className="bg-slate-700/80 pr-2 w-24 rounded-lg animate__animated animate__fadeIn">شماره تلفن</div>
    <div className="bg-slate-700/80 pr-2 w-24 rounded-lg animate__animated animate__fadeIn">گوگل</div>
  </div>;
};

let DropDown = ({ endOfPage, status, drawer, setDrawer }) => {
  return (
    <div
      dir="rtl"
      className={`fixed w-full  font-thin 
    ${endOfPage ? "mb-1 bottom-14 right-1" : "mt-1 top-14 right-1"}
    ${
      status
        ? "animate__animated animate__fadeIn"
        : "animate__animated animate__fadeOut"
    }
     h-fit z-40`}
    >
        <div className=" flex items-start justify-start gap-2 overflow-auto">
      <div className="flex flex-col gap-2  w-6/12  border px-2 py-2 rounded-xl shadow-lg bg-slate-800/20">
        <button className="text-white text-right font-bold bg-slate-700/80 shadow-lg pr-2 rounded-lg">
          ورود
        </button>
        <button
          onClick={(set) => {
            if (!drawer) {
              setDrawer(true);
            } else {
              setDrawer(false);
            }
          }}
          className="text-white text-right font-bold bg-slate-700/80 shadow-lg pr-2 rounded-lg"
        >
          ثبت نام
        </button>
        {buttons.map((div) => {
          return (
            <button className="text-white text-right hover:text-gray-800  bg-slate-600/70 shadow-lg rounded-lg pr-2 animate__animated animate__fadeInRight">
              {div}
            </button>
          );
        })}
      </div>
      {drawer ? <Gallery /> : null}
      </div>
    </div>
  );
};

function Menu({ endOfPage }) {
  const [dropDown, setDropDown] = useState(false);
  const [status, setStatus] = useState(false);
  const dropDownRef = useRef(null);
  const [drawer, setDrawer] = useState(false);

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
    <div className="flex items-center justify-center relative ">
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
              width={20}
              height={20}
            />
          </div>
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
      {dropDown ? (
        <div ref={dropDownRef}>
          <DropDown
            endOfPage={endOfPage}
            status={status}
            drawer={drawer}
            setDrawer={setDrawer}
          />
          
        </div>
      ) : null}
    </div>
  );
}

export default Menu;
