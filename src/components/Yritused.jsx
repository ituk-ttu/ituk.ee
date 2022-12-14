import * as React from "react";
import "./Yritused.css";
import Meelelahutus from "./images/events/DDIT2022.jpg";
import Haridus from "./images/events/konfluence.jpg";
import Siseüritus from "./images/pannakas.jpg";

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
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 m-3">
          <div class="max-w-sm bg-white rounded-lg border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <img class="rounded-t-lg h-48 w-96" src={Haridus} alt="" />

            <div class="p-5">
              <h5 class="mb-2 text-2xl font-bold tracking-tight  text-center text-[#870042] dark:text-white">
                Haridus
              </h5>

              <li>Praktikakohvik</li>
              <li>IT-ametite päev</li>
              <li>Konfluence</li>
              <li>Robocode</li>
              <li>Firma külastused</li>
              <li>Õpiõhtud</li>
            </div>
          </div>
          <div class="max-w-sm bg-white rounded-lg border border-gray-200 shadow-lg  dark:bg-gray-800 dark:border-gray-700 ">
            <img class="rounded-t-lg h-48 w-96" src={Meelelahutus} alt="" />
            <div class="p-5">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-center text-[#870042] dark:text-white">
                Meelelahutus
              </h5>
              <li>Tudengibaar</li>
              <li>IT-teaduskonna rebaste ristimine</li>
              <li>TechnÖÖ Jooks</li>

              <li>Don’t Do IT</li>
            </div>
          </div>
          <div class="max-w-sm bg-white rounded-lg border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <img class="rounded-t-lg   h-48 w-96" src={Siseüritus} alt="" />
            <div class="p-5">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-center text-[#870042]  dark:text-white">
                Siseüritused
              </h5>
              <li>Suve- ja talvepäevad </li>
              <li>Pannkoogihommikud</li>
              <li>Postitantsu koolitus</li>
              <li>Filmiõhtud</li>
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
