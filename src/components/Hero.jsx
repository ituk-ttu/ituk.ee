import React from "react";
import "./Hero.css";

const Hero = () => {
  return (
    <div className="hero">
      <div className="content">
        <p>Hei, IT-tudeng!</p>
        <p>Tere tulemast TalTech IT-teaduskonna üliõpilaskogu kodulehele!</p>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "https://liitu.ituk.ee/";
          }}
          className="button"
        >
          Liitu meiega!
        </button>
      </div>
    </div>
  );
};

export default Hero;
