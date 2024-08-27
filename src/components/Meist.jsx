import React from "react";
import "./Meist.css";
import tux from "./assets/videos/Tux2024.mp4";

var ITAP = (
  <a href="https://www.facebook.com/events/982662606348269/" target="_blank" rel="noopener noreferrer">IT-ametite päev</a>
)
var praktikakohvik = (
  <a href="https://www.facebook.com/events/915553479977551/" target="_blank" rel="noopener noreferrer">Praktikakohvik</a>
)
var taltech_gamecamp = (
  <a href="https://www.facebook.com/events/941131616967946" target="_blank" rel="noopener noreferrer">TalTech GameCamp</a>
)
var DDIT = (
  <a href="https://www.facebook.com/events/331427035946834/" target="_blank" rel="noopener noreferrer">Don't Do IT</a>
);
var tudengibaar = (
  <a href="https://www.facebook.com/events/1004681697465978/" target="_blank" rel="noopener noreferrer">Tudengibaar</a>
);
var rebaste_ristimine = (
  <a href="https://www.facebook.com/events/818282410416468/" target="_blank" rel="noopener noreferrer">
    IT-teaduskonna rebaste ristimine
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
              src={tux}
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
              populaarseimad hariduslikud üritused on: {ITAP},{" "}
              {praktikakohvik} ja {taltech_gamecamp}. Meelelahutust pakuvad {DDIT},{" "}
              {tudengibaar} ja {rebaste_ristimine}.
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
