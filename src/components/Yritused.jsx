import * as React from "react";
import "./Yritused.css";
import Meelelahutus from "./images/events/DDIT2022.jpg";
import Haridus from "./images/events/konfluence.jpg";
import Siseüritus from "./images/pannakas.jpg";
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

              <li>
                <a
                  href="https://www.facebook.com/events/341219044677369"
                  class="mr-4 hover:underline md:mr-6 "
                >
                  Praktikakohvik
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/events/1131315427395904/"
                  class="mr-4 hover:underline md:mr-6"
                >
                  IT-ametite päev
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/events/1382287772193543"
                  class="mr-4 hover:underline md:mr-6 "
                >
                  Konfluence
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/events/4953795681347259"
                  class="mr-4 hover:underline md:mr-6"
                >
                  Robocode
                </a>
              </li>
              <li>Firma külastused</li>
              <li>
                <a
                  href="https://www.facebook.com/events/1078881162836003"
                  class="mr-4 hover:underline md:mr-6"
                >
                  Õpiõhtud
                </a>
              </li>
            </div>
          </div>
          <div class="max-w-sm bg-white rounded-lg border border-gray-200 shadow-lg  dark:bg-gray-800 dark:border-gray-700 ">
            <img class="rounded-t-lg h-48 w-96" src={Meelelahutus} alt="" />
            <div class="p-5">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-center text-[#870042] dark:text-white">
                Meelelahutus
              </h5>
              <li>
                <a
                  href="https://www.facebook.com/events/590488846050321"
                  class="mr-4 hover:underline md:mr-6 "
                >
                  Tudengibaar
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/events/751480919440687"
                  class="mr-4 hover:underline md:mr-6"
                >
                  IT-teaduskonna rebaste ristimine
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/events/271426701503553/"
                  class="mr-4 hover:underline md:mr-6 "
                >
                  TechnÖÖ Jooks
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/events/1096342120997436"
                  class="mr-4 hover:underline md:mr-6"
                >
                  Don’t Do IT
                </a>
              </li>
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
      </div>
    </div>
  );
};

export default Cards;
