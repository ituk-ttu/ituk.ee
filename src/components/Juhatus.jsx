import React from "react";
import "./Juhatus.css";
import esimees from "./juhatus/2023/esimees-min.jpg";
import hr from "./juhatus/2023/hr-min.jpg";
import finants from "./juhatus/2023/finants-min.jpg";
import haridus from "./juhatus/2023/haridus-min.jpg";
import meelelahutus from "./juhatus/2023/meelelahutus-min.jpg";
import turundus from "./juhatus/2023/turundus-min.jpg";
import abi from "./juhatus/2023/abi-min.jpg";
import "tw-elements";

const Cards = () => {
  const cardInfo = [
    {
      image: esimees,
      name: "Sandra Lubi",
      job: "Juhatuse esimees",
      email: "sandra.lubi@ituk.ee",
    },
    {
      image: hr,
      name: "Gert Persidski",
      job: "Inimressursside juht",
      email: "gert.persidski@ituk.ee",
    },
    {
      image: finants,
      name: "Marcus Bindevald",
      job: "Finantsjuht",
      email: "marcus.bindevald@ituk.ee",
    },
    {
      image: haridus,
      name: "Kerttu Filippov",
      job: "Haridusjuht",
      email: "kerttu.filippov@ituk.ee",
    },
    {
      image: meelelahutus,
      name: "Kristian Erik Papp",
      job: "Meelelahutuse juht",
      email: "kristian.papp@ituk.ee",
    },

    {
      image: turundus,
      name: "Robin Nook",
      job: "Turundus- ja kommunikatsioonijuht",
      email: "robin.nook@ituk.ee",
    },

    {
      image: abi,
      name: "Merely Laast",
      job: "Juhiabi",
      email: "merely.laast@ituk.ee",
    },
  ];

  const renderCard = (card) => {
    return (
      <div class="transform transition duration-500 hover:scale-105 h-fit w-80 p-3 colums-3 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <img
          class="object-scale-down rounded-lg h-auto "
          src={card.image}
          alt="user1"
        />

        <h5 class="font-bold text-xl mb-2">{card.name}</h5>
        <span class="font-bold text-[#870042]">{card.job}</span>
        <div class="text-gray-700 text-base">
          <div class="flex items-center  mt-4">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {" "}
              {card.email}
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
            <a class="pl-1 text-[#4c4c4e]" href={`mailto:${card.email}`}>
              {card.email}
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="juhatus" id="juhatus">
      <h2>Juhatus</h2>
      <span className="line"></span>
      <div class="container flex gap-5  ">{cardInfo.map(renderCard)}</div>
    </div>
  );
};

export default Cards;
