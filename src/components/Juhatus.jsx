import React from "react";
import "./Juhatus.css";
import esimees from "./juhatus/2022/marga.jpg";
import hr from "./juhatus/2022/rasmus.jpg";
import finants from "./juhatus/2022/laura.jpg";
import haridus from "./juhatus/2022/kart.jpg";
import meelelahutus from "./juhatus/2022/sander.jpg";
// import turundus from "./juhatus/2022/marion.jpg";
import abi from "./juhatus/2022/elias.jpg";
import "tw-elements";
import { MdEmail } from "react-icons/md";

const Cards = () => {
  const cardInfo = [
    {
      image: esimees,
      name: "Margareth Lasn",
      job: "Juhatuse esimees",
      email: "margareth.lasn@ituk.ee",
    },
    {
      image: hr,
      name: "Rasmus Serg",
      job: "Inimressursside valdkonna juht",
      email: "rasmus.serg@ituk.ee",
    },
    {
      image: finants,
      name: "Laura-Liis Järvela",
      job: "Finantsvaldkonna juht",
      email: "lauraliis.jarvela@ituk.ee",
    },
    {
      image: haridus,
      name: "Kärt Annus",
      job: "Haridusvaldkonna juht",
      email: "kart.annus@ituk.ee",
    },
    {
      image: meelelahutus,
      name: "Sander Plukš",
      job: "Meelelahutusvaldkonna juht",
      email: "sander.pluks@ituk.ee",
    },
    // {
    //   image: turundus,
    //   name: "Marion Martin",
    //   job: "Turundus- ja kommunikatsioonivaldkonna juht",
    //   email: "marion.martin@ituk.ee",
    // },

    {
      image: abi,
      name: "Elias Ehasalu",
      job: "Juhiabi",
      email: "elias.ehasalu@ituk.ee",
    },
  ];

  const renderCard = (card) => {
    return (
      <div class="card ">
        <img src={card.image} alt="user1" />
        <h5 class="font-bold text-lg mb-2">{card.name}</h5>
        <span>{card.job}</span>
        <div className="email">
          <MdEmail />
          <a href={`mailto:${card.email}`}>{card.email}</a>
        </div>
      </div>
    );
  };

  return (
    <div className="juhatus" id="juhatus">
      <h2>Juhatus</h2>
      <span className="line"></span>
      <div class="container p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 flex items-center">
        {cardInfo.map(renderCard)}
      </div>
    </div>
  );
};

export default Cards;
