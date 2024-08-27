import * as React from "react";
import "./Yritused.css";
import Haridus from "./images/events/gamecamp2024.png";
import Meelelahutus from "./images/events/ristimine2024.png";
import Siseüritus from "./images/saunakas2024.png";

var events = (
  <a
    class=" text-[#870042]"
    href="https://www.facebook.com/ituk.taltech/events"
  >
    Facebooki eventide lehelt.
  </a>
);

const Cards = () => {
  return (
    <div className="yritused" id="yritused">
      <h2>Üritused</h2>
      <span className="line"></span>
      <div className="container">
        <div class=" grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 m-3">
          <div class="transform transition duration-500 hover:scale-105 max-w-sm bg-white rounded-lg border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <img class="rounded-t-lg h-48 w-96" src={Haridus} alt="" />

            <div class="p-5">
              <h5 class="mb-2 text-2xl font-bold tracking-tight  text-center text-[#870042] dark:text-white">
                Haridus
              </h5>
              <li>Praktikakohvik</li>
              <li>IT-ametite päev</li>
              <li>TalTech GameCamp</li>
              <li>Firma külastused</li>
              <li>Õpiõhtud</li>
            </div>
          </div>
          <div class="transform transition duration-500 hover:scale-105 max-w-sm bg-white rounded-lg border border-gray-200 shadow-lg  dark:bg-gray-800 dark:border-gray-700 ">
            <img class="rounded-t-lg h-48 w-96" src={Meelelahutus} alt="" />
            <div class="p-5">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-center text-[#870042] dark:text-white">
                Meelelahutus
              </h5>
              <li>IT-teaduskonna rebaste ristimine</li>
              <li>Don’t Do IT</li>
              <li>Tudengibaar</li>
              <li>Päkapikud IT-majast</li>
              <li>Kevadsport</li>
            </div>
          </div>
          <div class="transform transition duration-500 hover:scale-105 max-w-sm bg-white rounded-lg border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <img class="rounded-t-lg   h-48 w-96" src={Siseüritus} alt="" />
            <div class="p-5">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-center text-[#870042]  dark:text-white">
                Siseüritused
              </h5>
              <li>Suve- ja talvepäevad</li>
              <li>Pannkoogihommikud</li>
              <li>Võrkpalli mängimised</li>
              <li>Filmiõhtud</li>
              <li>Saunaõhtud</li>
            </div>
          </div>
        </div>
        <div class="flex items-center mt-10">
          <h1 class="mb-2 text-2xl tracking-tight text-center   dark:text-white">
            Rohkem infot ürituste kohta meie {events}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Cards;
