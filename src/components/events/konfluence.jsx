import React from "react";

const Konflu = () => {
  return (
    <div className="Konflu">
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

export default Konflu;
