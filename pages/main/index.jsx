import React from "react";
import Navbar from "../../components/Navbar";
import Random from "../../components/Random";
import "../../app/globals.css";
function index() {
  return (
    <div className="flex flex-col items-center justify-center bg-slate-300">
      <Navbar />
      <Random />
      <Random />
      <Random />
      <Random />
      <Random />
      <Random />
      <Random />
    </div>
  );
}

export default index;
