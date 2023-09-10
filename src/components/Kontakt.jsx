import React from "react";
import "./Kontakt.css";
import { MdEmail } from "react-icons/md";
import { MdFacebook } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { AiFillPhone } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";

const Kontakt = () => {
  return (
    <div className="kontakt pb-10" id="kontakt">
      <h2>Kontakt</h2>
      <span className="line"></span>
      <div className="container">
        <div class="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3  ">
          <div class="col-span-1 ">
            {/* <-- Kontakt info --> */}

            <h5>Info</h5>
            <ul>
              <li>
                <MdEmail />
                <a href="mailto:kontakt@ituk.ee">kontakt@ituk.ee</a>
              </li>
              <li>
                <AiFillPhone />
                <p>+372 5621 8221</p>
              </li>
              <li>
                <MdLocationPin />
                <p>Raja 4c, Tallinn, Harjumaa 12616</p>
              </li>

              {/* <-- Social media -->  */}
              <br />
              <br />
              <li>
                <MdFacebook />
                <a href="https://facebook.com/ituk.taltech">
                  facebook.com/ituk.taltech
                </a>
              </li>
              <li>
                <FaInstagram />
                <a href="https://www.instagram.com/ituk.taltech">
                  instagram.com/ituk.taltech
                </a>
              </li>
              <li>
                <FaGithub />
                <a href="https://www.github.com/ituk-ttu">
                  github.com/ituk-ttu
                </a>
              </li>
            </ul>
          </div>
          {/* <-- Maps --> */}
          <div class="col-span-2">
            <h5>Asukoht kaardil</h5>
            <div className="map">
              <iframe
                width="100%"
                height="100%"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2031.2584525450532!2d24.661989015991114!3d59.39540038168195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x469295a90aee413b%3A0x4f990fb010829ae5!2sTalTech%20IT%20College!5e0!3m2!1sen!2see!4v1652713340943!5m2!1sen!2see'"
                title="Map"
                frameborder="0"
                scrolling="no"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kontakt;
