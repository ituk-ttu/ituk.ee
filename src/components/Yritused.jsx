import * as React from "react";

import "./Yritused.css";
import Konfluence from "./images/events/konfluence.jpg";
import Tudengibaar from "./images/events/tudengibaar.jpg";
import Praktikakohvik from "./images/events/praktikakohvik.jpg";
import It_ametitepaev from "./images/events/it-ametitepaev.jpg";
import DDIT from "./images/events/DDIT.jpg";
import Robocode from "./images/events/robocode.jpg";
import Technoo_jooks from "./images/events/technoo_jooks.jpg";

import { CardActionArea } from "@mui/material";

const Cards = () => {
  const cardInfo = [
    {
      id: "https://www.facebook.com/events/1382287772193543",
      image: Konfluence,
      title: "Konfluence",
      text: "margareth.lasn@ituk.ee",
    },
    {
      id: "https://www.facebook.com/events/590488846050321",
      image: Tudengibaar,
      title: "Tudengibaar",
      text: "rasmus.serg@ituk.ee",
    },
    {
      id: "https://www.facebook.com/events/341219044677369",
      image: Praktikakohvik,
      title: "Praktikakohvik",
      text: "lauraliis.jarvela@ituk.ee",
    },
    {
      id: "https://www.facebook.com/events/1131315427395904/",
      image: It_ametitepaev,
      title: "IT-ametite päev",
      text: "kart.annus@ituk.ee",
    },
    {
      id: "https://www.facebook.com/events/657009918604465",
      image: DDIT,
      title: "Don't do IT",
      text: "sander.pluks@ituk.ee",
    },
    {
      id: "https://www.facebook.com/events/4953795681347259",
      image: Robocode,
      title: "Robocode 2022",
      text: "marion.martin@ituk.ee",
    },

    {
      id: "https://www.facebook.com/events/271426701503553",
      image: Technoo_jooks,
      title: "Technöö jooks",
      text: "elias.ehasalu@cybexeracademy.com",
    },
  ];

  const renderCard = (card) => {
    return (
      // <div class="item" onClick={routeChange}>

      <div class="item">
        <CardActionArea href={card.id}>
          <div class="polaroid" onClick={card.id}>
            <img src={card.image} alt="event" />
            <div class="caption">{card.title}</div>
          </div>
        </CardActionArea>
      </div>
    );
  };

  return (
    <div className="yritused" id="yritused">
      <h2>Üritused</h2>
      <span className="line"></span>
      <div class="container  ">
        <div class="wrapper">{cardInfo.map(renderCard)}</div>
      </div>
    </div>
  );
};

export default Cards;

// {cardInfo.map(renderCard)}
