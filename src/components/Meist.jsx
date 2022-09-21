import React from "react";
import "./Meist.css";
import tukk from "./assets/videos/tukk.mp4";

var tudengibaar = (
  <a href="https://www.facebook.com/events/590488846050321">Tudengibaar</a>
);
var Technoo_jooks = (
  <a href="https://www.facebook.com/events/271426701503553">TechnÖÖ Jooks</a>
);
var DDIT = (
  <a href="https://www.facebook.com/events/657009918604465">Don't Do IT</a>
);
var rebaste_ristimine = (
  <a href="https://www.facebook.com/events/308989330958977">
    IT-rebaste ristimine
  </a>
);

const About = () => {
  return (
    <div className="about" id="about">
      <div className="container">
        <div class="grid grid-cols-1 sm:grid-cols-1  md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3  ">
          <div class="col-span-1 grid justif-center p-6">
            <video
              class="w-full max-w-full h-auto"
              src={tukk}
              autoPlay
              loop
              muted
            />
          </div>

          <div class="col-span-2 p-5">
            <h2>Meist</h2>
            <span className="line"></span>
            <p class="text-xl font-medium  pt-4">
              ITÜKi on koondunud erinevatest infotehnoloogia teaduskonna
              erialadest väga mitmekülgne abivalmis seltskond, kes aitavad
              tudengite sõnadel pääseda võimule ning muredele leida lahendusi.
            </p>
            <p class="text-xl font-medium  pt-4">
              Eelkõige tegelebki ITÜK ehk IT-teaduskonna üliõpilaskogu tudengite
              esindamise, hariduse edendamise ning meelelahutusega. Meie
              populaarseimad hariduslikud üritused on: IT-ametite päev,
              Praktikakohvik, Konfluence. Meelelahutust pakuvad {DDIT},{" "}
              {tudengibaar}, {Technoo_jooks} ja {rebaste_ristimine}.
            </p>
            <p class="text-xl font-medium  pt-4">
              Lisaks suurüritustele korraldame ka oma liikmetele vahvaid
              siseüritusi, koolitusi ning õpiabi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
