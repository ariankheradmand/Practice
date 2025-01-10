import "../../app/globals.css";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Random from "../../components/Random";
import { useInView } from "react-intersection-observer";
import Head from "next/head";
import Popular from "./Popular";
import Hero from "../../components/Hero";

function HomePage() {
  const [placement, setPlacement] = useState(-1115);
  const [rightLeft, setRightLeft] = useState("-");
  const [isScrolled, setIsScrolled] = useState(false);
  const [value, setValue] = useState("");
  const [isSmooth, setIsSmooth] = useState(false);

  const MouseContent = () => {
    return (
      <div
        className="absolute transition-all invisible"
        style={{
          transform: `translateY(${placement}px) translateX(${rightLeft}140px)`,
        }}
      >
        <div className="animate__animated animate__pulse border py-2 px-2 rounded-xl bg-gradient-to-br from-gray-600/40 via-gray-200/40 to-gray-800/60 bg-[length:200%_200%] animate-gradient backdrop-blur-md">
          {value}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
      if (isScrolled) {
        setPlacement(-1115);
        setRightLeft("-");
      }
    };


    window.addEventListener("scroll", handleScroll);
    if (isScrolled >= (isScrolled + 511)) {
       setIsSmooth(true);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    
  }, [isSmooth]);

  const RandomWrapper = ({ value, initialPlacement, initialRightLeft }) => {
    const { ref, inView } = useInView({
      threshold: 0.5,
      triggerOnce: false,
      onChange: (inView) => {
        if (inView) {
          setPlacement(initialPlacement);
          setRightLeft(initialRightLeft);
          setValue(value); // Correctly set the value here
        }
      },
    });

    return <Random ref={ref} />;
  };

  return (
    <div className="flex flex-col relative items-center justify-center bg-gradient-to-b from-black/90 via-yellow-500 to-white/90">
      <Head>
        <title>Main Page</title>
      </Head>
      <Navbar  />
      <Hero />
      <Popular />
      <MouseContent />
      <RandomWrapper
        value="first"
        initialPlacement={-1115}
        initialRightLeft="-"
      />
      <RandomWrapper
        value="second"
        initialPlacement={-604}
        initialRightLeft=""
      />
      <RandomWrapper
        value="third"
        initialPlacement={-91}
        initialRightLeft="-"
      />
      
    </div>
  );
}

export default HomePage;